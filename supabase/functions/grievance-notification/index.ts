// ================================================================
// Supabase Edge Function: grievance-notification
// ================================================================
// Triggered via a Supabase Database Webhook on the `grievances`
// table (UPDATE events). Fires ONLY when status changes from
// 'pending' → 'accepted'.
//
// HOW TO DEPLOY:
//   supabase functions deploy grievance-notification
//
// HOW TO SET SECRETS (run once):
//   supabase secrets set NOTIFICATION_PROVIDER=msg91
//   supabase secrets set MSG91_AUTH_KEY=your_key_here
//   supabase secrets set MSG91_TEMPLATE_ID=your_template_id
//   supabase secrets set MSG91_SENDER_ID=TVKWRD
//   # --- OR for WhatsApp (WATI) ---
//   supabase secrets set NOTIFICATION_PROVIDER=wati
//   supabase secrets set WATI_API_TOKEN=your_token_here
//   supabase secrets set WATI_ENDPOINT=https://live-mt-server.wati.io/YOUR_ACCOUNT_ID
//
// HOW TO CREATE THE WEBHOOK (Supabase Dashboard):
//   Table: grievances | Event: UPDATE
//   URL: https://<project-ref>.supabase.co/functions/v1/grievance-notification
//   HTTP Headers: Authorization: Bearer <SUPABASE_SERVICE_ROLE_KEY>
// ================================================================

import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

// ── Types ───────────────────────────────────────────────────────
interface WebhookPayload {
  type: "INSERT" | "UPDATE" | "DELETE";
  table: string;
  schema: string;
  record: GrievanceRecord;       // new row state
  old_record: GrievanceRecord;   // previous row state (UPDATE only)
}

interface GrievanceRecord {
  id: string;
  citizen_name: string;
  phone_number: string;
  issue_type: string;
  description: string;
  status: "pending" | "accepted";
  created_at: string;
}

// ── Main Handler ────────────────────────────────────────────────
serve(async (req: Request) => {
  try {
    // 1. Only handle POST
    if (req.method !== "POST") {
      return new Response("Method not allowed", { status: 405 });
    }

    const payload: WebhookPayload = await req.json();

    // 2. Guard: only fire on UPDATE where status flipped pending → accepted
    if (
      payload.type !== "UPDATE" ||
      payload.old_record?.status !== "pending" ||
      payload.record?.status !== "accepted"
    ) {
      return new Response(
        JSON.stringify({ skipped: true, reason: "Not a pending→accepted transition" }),
        { status: 200, headers: { "Content-Type": "application/json" } }
      );
    }

    const { citizen_name, phone_number, issue_type } = payload.record;

    console.log(`[TVK Notification] Grievance accepted for: ${citizen_name} (${phone_number})`);

    // 3. Route to the configured provider
    const provider = Deno.env.get("NOTIFICATION_PROVIDER") ?? "msg91";
    let result: NotificationResult;

    if (provider === "wati") {
      result = await sendWhatsAppWATI(citizen_name, phone_number, issue_type);
    } else {
      // Default: MSG91 SMS
      result = await sendSMSMsg91(citizen_name, phone_number, issue_type);
    }

    console.log(`[TVK Notification] Result:`, result);

    return new Response(JSON.stringify(result), {
      status: result.success ? 200 : 500,
      headers: { "Content-Type": "application/json" },
    });

  } catch (err) {
    console.error("[TVK Notification] Unhandled error:", err);
    return new Response(
      JSON.stringify({ success: false, error: String(err) }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
});

// ================================================================
// PROVIDER 1: MSG91 SMS
// ================================================================
// Docs: https://docs.msg91.com/reference/send-sms
// DLT Template (register this on MSG91 dashboard):
//   "Dear {citizen_name}, your complaint regarding {issue_type}
//    has been officially acknowledged by the TVK constituency
//    office. We will work to resolve it at the earliest.
//    - TVK Ward Office"
// ================================================================

interface NotificationResult {
  success: boolean;
  provider: string;
  response?: unknown;
  error?: string;
}

async function sendSMSMsg91(
  name: string,
  phone: string,
  issueType: string
): Promise<NotificationResult> {
  const authKey    = Deno.env.get("MSG91_AUTH_KEY");
  const templateId = Deno.env.get("MSG91_TEMPLATE_ID");
  const senderId   = Deno.env.get("MSG91_SENDER_ID") ?? "TVKWRD";

  if (!authKey || !templateId) {
    return {
      success: false,
      provider: "msg91",
      error: "MSG91_AUTH_KEY or MSG91_TEMPLATE_ID not set in Supabase secrets",
    };
  }

  // Indian numbers must be prefixed with 91 (no +)
  const mobile = phone.startsWith("91") ? phone : `91${phone}`;

  const body = {
    template_id: templateId,
    sender: senderId,
    short_url: "0",
    mobiles: mobile,
    VAR1: name,          // maps to {citizen_name} in DLT template
    VAR2: issueType,     // maps to {issue_type} in DLT template
  };

  const response = await fetch("https://control.msg91.com/api/v5/flow/", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "authkey": authKey,
    },
    body: JSON.stringify(body),
  });

  const data = await response.json();
  return {
    success: response.ok,
    provider: "msg91",
    response: data,
    error: response.ok ? undefined : JSON.stringify(data),
  };
}

// ================================================================
// PROVIDER 2: WhatsApp via WATI
// ================================================================
// Docs: https://docs.wati.io/reference/post_api-v1-sendtemplatemessage
// Set up a WhatsApp template named "grievance_accepted" on WATI
// with parameters: {{1}} = citizen name, {{2}} = issue type
// ================================================================
async function sendWhatsAppWATI(
  name: string,
  phone: string,
  issueType: string
): Promise<NotificationResult> {
  const token    = Deno.env.get("WATI_API_TOKEN");
  const endpoint = Deno.env.get("WATI_ENDPOINT"); // e.g. https://live-mt-server.wati.io/ACCOUNT_ID

  if (!token || !endpoint) {
    return {
      success: false,
      provider: "wati",
      error: "WATI_API_TOKEN or WATI_ENDPOINT not set in Supabase secrets",
    };
  }

  // WATI expects the number in international format without +
  const whatsappNumber = phone.startsWith("91") ? phone : `91${phone}`;

  const body = {
    template_name: "grievance_accepted",
    broadcast_name: `grievance_${Date.now()}`,
    parameters: [
      { name: "1", value: name },
      { name: "2", value: issueType },
    ],
  };

  const response = await fetch(
    `${endpoint}/api/v1/sendTemplateMessage?whatsappNumber=${whatsappNumber}`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`,
      },
      body: JSON.stringify(body),
    }
  );

  const data = await response.json();
  return {
    success: response.ok,
    provider: "wati",
    response: data,
    error: response.ok ? undefined : JSON.stringify(data),
  };
}
