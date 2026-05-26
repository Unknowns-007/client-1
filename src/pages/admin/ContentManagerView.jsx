import { useEffect, useState } from 'react'
import { supabase } from '../../lib/supabase'
import { useAuth } from '../../context/AuthContext'
import toast from 'react-hot-toast'
import {
  Plus, Pencil, Trash2, X, Save, Image, Calendar,
  FileText, Users, Flame, LogOut, LayoutDashboard
} from 'lucide-react'

// ─── Reusable Modal ───────────────────────────────────────────
function Modal({ title, onClose, children }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
      <div className="bg-surface-2 border border-border rounded-2xl w-full max-w-lg shadow-2xl">
        <div className="flex items-center justify-between p-5 border-b border-border">
          <h3 className="text-white font-bold text-lg">{title}</h3>
          <button onClick={onClose} className="text-gray-500 hover:text-white transition-colors p-1 rounded-lg hover:bg-white/10">
            <X size={20} />
          </button>
        </div>
        <div className="p-5">{children}</div>
      </div>
    </div>
  )
}

// ─── Events & Blog Manager ────────────────────────────────────
function EventsBlogManager({ type }) {
  const { profile } = useAuth()
  const [items, setItems] = useState([])
  const [loading, setLoading] = useState(true)
  const [modal, setModal] = useState(null) // null | 'create' | item (for edit)
  const [form, setForm] = useState({ title: '', description: '', image_url: '', event_date: '', type })
  const [saving, setSaving] = useState(false)

  const icon = type === 'event' ? <Calendar size={16} className="text-tvk-yellow" /> : <FileText size={16} className="text-purple-400" />
  const label = type === 'event' ? 'Events' : 'Blog Posts'

  const fetchItems = async () => {
    const { data } = await supabase.from('events_blog').select('*').eq('type', type).order('created_at', { ascending: false })
    setItems(data || [])
    setLoading(false)
  }

  useEffect(() => { fetchItems() }, [type])

  const openCreate = () => {
    setForm({ title: '', description: '', image_url: '', event_date: '', type })
    setModal('create')
  }

  const openEdit = (item) => {
    setForm({ title: item.title, description: item.description || '', image_url: item.image_url || '', event_date: item.event_date || '', type })
    setModal(item)
  }

  const handleSave = async () => {
    if (!form.title.trim()) { toast.error('Title is required'); return }
    setSaving(true)
    const payload = { ...form, created_by: profile?.id }

    if (modal === 'create') {
      const { error } = await supabase.from('events_blog').insert([payload])
      if (error) toast.error('Failed to create')
      else { toast.success(`${label.slice(0, -1)} created!`); fetchItems(); setModal(null) }
    } else {
      const { error } = await supabase.from('events_blog').update(payload).eq('id', modal.id)
      if (error) toast.error('Failed to update')
      else { toast.success('Updated!'); fetchItems(); setModal(null) }
    }
    setSaving(false)
  }

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this item?')) return
    const { error } = await supabase.from('events_blog').delete().eq('id', id)
    if (error) toast.error('Failed to delete')
    else { toast.success('Deleted'); fetchItems() }
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-5">
        <div className="flex items-center gap-2">
          {icon}
          <h2 className="text-white font-bold text-xl">{label}</h2>
          <span className="bg-surface-3 text-gray-400 text-xs px-2 py-0.5 rounded-full">{items.length}</span>
        </div>
        <button onClick={openCreate} className="btn-primary text-sm py-2 px-4">
          <Plus size={16} /> New {label.slice(0, -1)}
        </button>
      </div>

      {loading ? (
        <div className="space-y-3">{[...Array(3)].map((_, i) => <div key={i} className="h-16 bg-surface-3 rounded-xl animate-pulse" />)}</div>
      ) : items.length === 0 ? (
        <div className="text-center py-12 text-gray-500 border border-dashed border-border rounded-xl">
          <p className="text-sm">No {label.toLowerCase()} yet. Create the first one.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {items.map(item => (
            <div key={item.id} className="flex items-center justify-between bg-surface-3 border border-border rounded-xl px-4 py-3 hover:border-tvk-red/30 transition-colors">
              <div className="flex items-center gap-3 min-w-0">
                {item.image_url
                  ? <img src={item.image_url} alt="" className="w-10 h-10 rounded-lg object-cover shrink-0" />
                  : <div className="w-10 h-10 bg-surface-2 rounded-lg flex items-center justify-center shrink-0"><Image size={16} className="text-gray-600" /></div>
                }
                <div className="min-w-0">
                  <p className="text-white font-medium text-sm truncate">{item.title}</p>
                  <p className="text-gray-500 text-xs">{new Date(item.created_at).toLocaleDateString('en-IN')}</p>
                </div>
              </div>
              <div className="flex items-center gap-2 shrink-0 ml-4">
                <button onClick={() => openEdit(item)} className="text-gray-400 hover:text-tvk-yellow transition-colors p-1.5 rounded-lg hover:bg-tvk-yellow/10">
                  <Pencil size={15} />
                </button>
                <button onClick={() => handleDelete(item.id)} className="text-gray-400 hover:text-tvk-red transition-colors p-1.5 rounded-lg hover:bg-tvk-red/10">
                  <Trash2 size={15} />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {modal && (
        <Modal title={modal === 'create' ? `New ${label.slice(0, -1)}` : `Edit: ${modal.title}`} onClose={() => setModal(null)}>
          <div className="space-y-4">
            <div>
              <label className="form-label">Title *</label>
              <input className="form-input" value={form.title} onChange={e => setForm({ ...form, title: e.target.value })} placeholder="Title" />
            </div>
            <div>
              <label className="form-label">Description</label>
              <textarea className="form-input resize-none" rows={4} value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} placeholder="Description..." />
            </div>
            <div>
              <label className="form-label">Image URL</label>
              <input className="form-input" value={form.image_url} onChange={e => setForm({ ...form, image_url: e.target.value })} placeholder="https://..." />
            </div>
            {type === 'event' && (
              <div>
                <label className="form-label">Event Date</label>
                <input type="date" className="form-input" value={form.event_date} onChange={e => setForm({ ...form, event_date: e.target.value })} />
              </div>
            )}
            <button onClick={handleSave} disabled={saving} className="btn-primary w-full justify-center">
              {saving ? <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : <><Save size={16} /> Save</>}
            </button>
          </div>
        </Modal>
      )}
    </div>
  )
}

// ─── About Leads Manager ──────────────────────────────────────
function LeadsManager() {
  const [leaders, setLeaders] = useState([])
  const [loading, setLoading] = useState(true)
  const [modal, setModal] = useState(null)
  const [form, setForm] = useState({ name: '', designation: '', photo_url: '', contact_details: { phone: '', email: '', address: '' }, display_order: 0 })
  const [saving, setSaving] = useState(false)

  const fetchLeaders = async () => {
    const { data } = await supabase.from('about_leads').select('*').order('display_order')
    setLeaders(data || [])
    setLoading(false)
  }

  useEffect(() => { fetchLeaders() }, [])

  const openCreate = () => {
    setForm({ name: '', designation: '', photo_url: '', contact_details: { phone: '', email: '', address: '' }, display_order: leaders.length })
    setModal('create')
  }

  const openEdit = (item) => {
    setForm({ name: item.name, designation: item.designation, photo_url: item.photo_url || '', contact_details: item.contact_details || { phone: '', email: '', address: '' }, display_order: item.display_order || 0 })
    setModal(item)
  }

  const handleSave = async () => {
    if (!form.name.trim() || !form.designation.trim()) { toast.error('Name and designation are required'); return }
    setSaving(true)
    if (modal === 'create') {
      const { error } = await supabase.from('about_leads').insert([form])
      if (error) toast.error('Failed') ; else { toast.success('Leader added!'); fetchLeaders(); setModal(null) }
    } else {
      const { error } = await supabase.from('about_leads').update(form).eq('id', modal.id)
      if (error) toast.error('Failed'); else { toast.success('Updated!'); fetchLeaders(); setModal(null) }
    }
    setSaving(false)
  }

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this leader?')) return
    await supabase.from('about_leads').delete().eq('id', id)
    toast.success('Deleted'); fetchLeaders()
  }

  const setContact = (key, val) => setForm(f => ({ ...f, contact_details: { ...f.contact_details, [key]: val } }))

  return (
    <div>
      <div className="flex items-center justify-between mb-5">
        <div className="flex items-center gap-2">
          <Users size={16} className="text-blue-400" />
          <h2 className="text-white font-bold text-xl">Constituency Leaders</h2>
          <span className="bg-surface-3 text-gray-400 text-xs px-2 py-0.5 rounded-full">{leaders.length}</span>
        </div>
        <button onClick={openCreate} className="btn-primary text-sm py-2 px-4"><Plus size={16} /> Add Leader</button>
      </div>

      {loading ? (
        <div className="space-y-3">{[...Array(3)].map((_, i) => <div key={i} className="h-16 bg-surface-3 rounded-xl animate-pulse" />)}</div>
      ) : leaders.length === 0 ? (
        <div className="text-center py-12 text-gray-500 border border-dashed border-border rounded-xl"><p className="text-sm">No leaders added yet.</p></div>
      ) : (
        <div className="space-y-3">
          {leaders.map(l => (
            <div key={l.id} className="flex items-center justify-between bg-surface-3 border border-border rounded-xl px-4 py-3 hover:border-tvk-red/30 transition-colors">
              <div className="flex items-center gap-3 min-w-0">
                {l.photo_url
                  ? <img src={l.photo_url} alt={l.name} className="w-10 h-10 rounded-full object-cover ring-2 ring-tvk-red/30 shrink-0" />
                  : <div className="w-10 h-10 bg-gradient-to-br from-tvk-red to-tvk-yellow rounded-full flex items-center justify-center shrink-0 text-white text-xs font-bold">{l.name[0]}</div>
                }
                <div className="min-w-0">
                  <p className="text-white font-medium text-sm">{l.name}</p>
                  <p className="text-tvk-yellow text-xs">{l.designation}</p>
                </div>
              </div>
              <div className="flex items-center gap-2 shrink-0 ml-4">
                <button onClick={() => openEdit(l)} className="text-gray-400 hover:text-tvk-yellow transition-colors p-1.5 rounded-lg hover:bg-tvk-yellow/10"><Pencil size={15} /></button>
                <button onClick={() => handleDelete(l.id)} className="text-gray-400 hover:text-tvk-red transition-colors p-1.5 rounded-lg hover:bg-tvk-red/10"><Trash2 size={15} /></button>
              </div>
            </div>
          ))}
        </div>
      )}

      {modal && (
        <Modal title={modal === 'create' ? 'Add Leader' : `Edit: ${modal.name}`} onClose={() => setModal(null)}>
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-3">
              <div><label className="form-label">Full Name *</label><input className="form-input" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} placeholder="Name" /></div>
              <div><label className="form-label">Designation *</label><input className="form-input" value={form.designation} onChange={e => setForm({ ...form, designation: e.target.value })} placeholder="e.g. Ward President" /></div>
            </div>
            <div><label className="form-label">Photo URL</label><input className="form-input" value={form.photo_url} onChange={e => setForm({ ...form, photo_url: e.target.value })} placeholder="https://..." /></div>
            <div className="grid grid-cols-2 gap-3">
              <div><label className="form-label">Phone</label><input className="form-input" value={form.contact_details.phone} onChange={e => setContact('phone', e.target.value)} placeholder="Mobile" /></div>
              <div><label className="form-label">Email</label><input className="form-input" value={form.contact_details.email} onChange={e => setContact('email', e.target.value)} placeholder="Email" /></div>
            </div>
            <div><label className="form-label">Address</label><input className="form-input" value={form.contact_details.address} onChange={e => setContact('address', e.target.value)} placeholder="Office address" /></div>
            <div><label className="form-label">Display Order</label><input type="number" className="form-input" value={form.display_order} onChange={e => setForm({ ...form, display_order: parseInt(e.target.value) || 0 })} /></div>
            <button onClick={handleSave} disabled={saving} className="btn-primary w-full justify-center">
              {saving ? <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : <><Save size={16} /> Save</>}
            </button>
          </div>
        </Modal>
      )}
    </div>
  )
}

// ─── Main Content Manager View ────────────────────────────────
const TABS = [
  { id: 'events', label: 'Events', icon: Calendar },
  { id: 'blog', label: 'Blog', icon: FileText },
  { id: 'leaders', label: 'Leaders', icon: Users },
]

export default function ContentManagerView() {
  const [activeTab, setActiveTab] = useState('events')
  const { profile, signOut } = useAuth()

  return (
    <div className="min-h-screen bg-black">
      {/* Top Bar */}
      <header className="bg-surface-2 border-b border-border sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between h-16">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 bg-gradient-to-br from-tvk-red to-tvk-yellow rounded-lg flex items-center justify-center">
              <Flame size={18} className="text-white" />
            </div>
            <div>
              <p className="text-white font-bold text-sm leading-none">Content Manager</p>
              <p className="text-gray-500 text-xs mt-0.5">{profile?.email}</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <a href="/" target="_blank" className="text-gray-400 hover:text-white text-sm transition-colors flex items-center gap-1.5">
              <LayoutDashboard size={14} /> View Site
            </a>
            <button onClick={signOut} className="text-gray-400 hover:text-tvk-red transition-colors flex items-center gap-1.5 text-sm">
              <LogOut size={14} /> Sign Out
            </button>
          </div>
        </div>
      </header>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Tab Nav */}
        <div className="flex gap-2 mb-8 bg-surface-2 border border-border rounded-xl p-1.5 w-fit">
          {TABS.map(({ id, label, icon: Icon }) => (
            <button
              key={id}
              onClick={() => setActiveTab(id)}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                activeTab === id
                  ? 'bg-tvk-red text-white shadow-lg'
                  : 'text-gray-400 hover:text-white hover:bg-surface-3'
              }`}
            >
              <Icon size={15} /> {label}
            </button>
          ))}
        </div>

        {/* Content */}
        {activeTab === 'events' && <EventsBlogManager type="event" />}
        {activeTab === 'blog' && <EventsBlogManager type="blog" />}
        {activeTab === 'leaders' && <LeadsManager />}
      </div>
    </div>
  )
}
