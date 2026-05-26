-- ============================================================
-- TVK Constituency Portal — Supabase SQL Schema
-- Run this entire script in the Supabase SQL Editor
-- ============================================================

-- ─────────────────────────────────────────────
-- 0. Extensions
-- ─────────────────────────────────────────────
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ─────────────────────────────────────────────
-- 1. PROFILES
-- Linked to Supabase auth.users. Stores party
-- worker roles (content_manager / welfare_officer).
-- ─────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.profiles (
  id          UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email       TEXT NOT NULL,
  role        TEXT NOT NULL CHECK (role IN ('content_manager', 'welfare_officer')),
  full_name   TEXT,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Auto-populate profiles on new auth user signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER LANGUAGE plpgsql SECURITY DEFINER AS $$
BEGIN
  INSERT INTO public.profiles (id, email)
  VALUES (NEW.id, NEW.email)
  ON CONFLICT (id) DO NOTHING;
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- ─────────────────────────────────────────────
-- 2. EVENTS & BLOG
-- Stores both event records and blog/press-release posts.
-- ─────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.events_blog (
  id           UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  type         TEXT NOT NULL CHECK (type IN ('event', 'blog')),
  title        TEXT NOT NULL,
  description  TEXT,
  image_url    TEXT,
  event_date   DATE,
  created_at   TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  created_by   UUID REFERENCES public.profiles(id) ON DELETE SET NULL
);

-- ─────────────────────────────────────────────
-- 3. ABOUT LEADS
-- Constituency leader / party office-bearer profiles.
-- ─────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.about_leads (
  id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name            TEXT NOT NULL,
  designation     TEXT NOT NULL,
  photo_url       TEXT,
  contact_details JSONB DEFAULT '{}'::jsonb,
  display_order   INTEGER DEFAULT 0,
  created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ─────────────────────────────────────────────
-- 4. BLOOD INVENTORY
-- One row per blood group. Upsert-based updates.
-- ─────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.blood_inventory (
  id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  blood_group     TEXT NOT NULL UNIQUE CHECK (blood_group IN ('A+','A-','B+','B-','AB+','AB-','O+','O-')),
  units_available INTEGER NOT NULL DEFAULT 0 CHECK (units_available >= 0),
  updated_at      TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Seed initial blood inventory rows (idempotent)
INSERT INTO public.blood_inventory (blood_group, units_available) VALUES
  ('A+',  0), ('A-',  0),
  ('B+',  0), ('B-',  0),
  ('AB+', 0), ('AB-', 0),
  ('O+',  0), ('O-',  0)
ON CONFLICT (blood_group) DO NOTHING;

-- Auto-update updated_at on blood_inventory changes
CREATE OR REPLACE FUNCTION public.set_blood_updated_at()
RETURNS TRIGGER LANGUAGE plpgsql AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS blood_inventory_updated_at ON public.blood_inventory;
CREATE TRIGGER blood_inventory_updated_at
  BEFORE UPDATE ON public.blood_inventory
  FOR EACH ROW EXECUTE FUNCTION public.set_blood_updated_at();

-- ─────────────────────────────────────────────
-- 5. GRIEVANCES
-- Public complaint submissions. No public read.
-- ─────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.grievances (
  id            UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  citizen_name  TEXT NOT NULL,
  phone_number  TEXT NOT NULL CHECK (phone_number ~ '^[6-9][0-9]{9}$'),
  issue_type    TEXT NOT NULL CHECK (issue_type IN (
                  'Potholes', 'Water Supply', 'Streetlights',
                  'Garbage Collection', 'Drainage', 'Public Parks', 'Other'
                )),
  description   TEXT NOT NULL,
  status        TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'accepted')),
  created_at    TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ============================================================
-- ROW LEVEL SECURITY (RLS)
-- ============================================================

-- Enable RLS on all tables
ALTER TABLE public.profiles       ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.events_blog    ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.about_leads    ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.blood_inventory ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.grievances     ENABLE ROW LEVEL SECURITY;

-- ─── Helper function: get current user's role ──────────────
CREATE OR REPLACE FUNCTION public.get_my_role()
RETURNS TEXT LANGUAGE sql SECURITY DEFINER STABLE AS $$
  SELECT role FROM public.profiles WHERE id = auth.uid();
$$;

-- ─────────────────────────────────────────────
-- RLS: profiles
-- Users can only read/update their own profile.
-- ─────────────────────────────────────────────
DROP POLICY IF EXISTS "profiles: own read"   ON public.profiles;
DROP POLICY IF EXISTS "profiles: own update" ON public.profiles;

CREATE POLICY "profiles: own read"
  ON public.profiles FOR SELECT
  USING (auth.uid() = id);

CREATE POLICY "profiles: own update"
  ON public.profiles FOR UPDATE
  USING (auth.uid() = id);

-- ─────────────────────────────────────────────
-- RLS: events_blog
-- Public read. Full CRUD for content_manager.
-- ─────────────────────────────────────────────
DROP POLICY IF EXISTS "events_blog: public read"          ON public.events_blog;
DROP POLICY IF EXISTS "events_blog: content_manager insert" ON public.events_blog;
DROP POLICY IF EXISTS "events_blog: content_manager update" ON public.events_blog;
DROP POLICY IF EXISTS "events_blog: content_manager delete" ON public.events_blog;

CREATE POLICY "events_blog: public read"
  ON public.events_blog FOR SELECT
  USING (true);

CREATE POLICY "events_blog: content_manager insert"
  ON public.events_blog FOR INSERT
  WITH CHECK (public.get_my_role() = 'content_manager');

CREATE POLICY "events_blog: content_manager update"
  ON public.events_blog FOR UPDATE
  USING (public.get_my_role() = 'content_manager');

CREATE POLICY "events_blog: content_manager delete"
  ON public.events_blog FOR DELETE
  USING (public.get_my_role() = 'content_manager');

-- ─────────────────────────────────────────────
-- RLS: about_leads
-- Public read. Full CRUD for content_manager.
-- ─────────────────────────────────────────────
DROP POLICY IF EXISTS "about_leads: public read"             ON public.about_leads;
DROP POLICY IF EXISTS "about_leads: content_manager insert"  ON public.about_leads;
DROP POLICY IF EXISTS "about_leads: content_manager update"  ON public.about_leads;
DROP POLICY IF EXISTS "about_leads: content_manager delete"  ON public.about_leads;

CREATE POLICY "about_leads: public read"
  ON public.about_leads FOR SELECT
  USING (true);

CREATE POLICY "about_leads: content_manager insert"
  ON public.about_leads FOR INSERT
  WITH CHECK (public.get_my_role() = 'content_manager');

CREATE POLICY "about_leads: content_manager update"
  ON public.about_leads FOR UPDATE
  USING (public.get_my_role() = 'content_manager');

CREATE POLICY "about_leads: content_manager delete"
  ON public.about_leads FOR DELETE
  USING (public.get_my_role() = 'content_manager');

-- ─────────────────────────────────────────────
-- RLS: blood_inventory
-- Public read. Only welfare_officer can update.
-- ─────────────────────────────────────────────
DROP POLICY IF EXISTS "blood_inventory: public read"          ON public.blood_inventory;
DROP POLICY IF EXISTS "blood_inventory: welfare_officer update" ON public.blood_inventory;

CREATE POLICY "blood_inventory: public read"
  ON public.blood_inventory FOR SELECT
  USING (true);

CREATE POLICY "blood_inventory: welfare_officer update"
  ON public.blood_inventory FOR UPDATE
  USING (public.get_my_role() = 'welfare_officer');

-- ─────────────────────────────────────────────
-- RLS: grievances
-- Public INSERT (anon citizens can submit).
-- NO public read. Welfare officer can read & update status.
-- ─────────────────────────────────────────────
DROP POLICY IF EXISTS "grievances: public insert"             ON public.grievances;
DROP POLICY IF EXISTS "grievances: welfare_officer read"      ON public.grievances;
DROP POLICY IF EXISTS "grievances: welfare_officer update"    ON public.grievances;

CREATE POLICY "grievances: public insert"
  ON public.grievances FOR INSERT
  WITH CHECK (true);

CREATE POLICY "grievances: welfare_officer read"
  ON public.grievances FOR SELECT
  USING (public.get_my_role() = 'welfare_officer');

CREATE POLICY "grievances: welfare_officer update"
  ON public.grievances FOR UPDATE
  USING (public.get_my_role() = 'welfare_officer');

-- ============================================================
-- END OF SCHEMA
-- ============================================================
