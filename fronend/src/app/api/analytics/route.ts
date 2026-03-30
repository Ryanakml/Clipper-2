import { analyticsEventSchema } from "~/lib/analytics";

const ANALYTICS_TABLE = "analytics_events_chattiphy";

function sanitizeString(value?: string | null, maxLength = 2048) {
  if (!value) return null;

  const normalizedValue = value.trim().slice(0, maxLength);
  return normalizedValue.length > 0 ? normalizedValue : null;
}

export async function POST(request: Request) {
  const supabaseUrl = process.env.ANALYTICS_SUPABASE_URL;
  const serviceRoleKey = process.env.ANALYTICS_SUPABASE_SERVICE_ROLE_KEY;

  if (!supabaseUrl || !serviceRoleKey) {
    return Response.json(
      { error: "Analytics is not configured." },
      { status: 503 },
    );
  }

  const rawPayload = await request.json().catch(() => null);
  const parsedPayload = analyticsEventSchema.safeParse(rawPayload);

  if (!parsedPayload.success) {
    return Response.json(
      { error: "Invalid analytics payload." },
      { status: 400 },
    );
  }

  const payload = parsedPayload.data;
  const forwardedFor = request.headers.get("x-forwarded-for");
  const ipAddress = forwardedFor?.split(",")[0]?.trim() ?? null;

  const insertPayload = {
    occurred_at: payload.occurredAt,
    event_type: payload.eventType,
    page_path: sanitizeString(payload.pagePath),
    page_title: sanitizeString(payload.pageTitle, 512),
    session_id: sanitizeString(payload.sessionId, 128),
    visitor_id: sanitizeString(payload.visitorId, 128),
    element_label: sanitizeString(payload.elementLabel, 512),
    element_target: sanitizeString(payload.elementTarget),
    element_type: sanitizeString(payload.elementType, 128),
    scroll_percent: payload.scrollPercent ?? null,
    device_type: sanitizeString(payload.deviceType, 64),
    browser_name: sanitizeString(payload.browserName, 128),
    os_name: sanitizeString(payload.osName, 128),
    viewport_width: payload.viewportWidth ?? null,
    viewport_height: payload.viewportHeight ?? null,
    language: sanitizeString(payload.language, 64),
    referrer: sanitizeString(payload.referrer),
    user_agent: sanitizeString(payload.userAgent, 1024),
    metadata: {
      ...(payload.metadata ?? {}),
      server_context: {
        ip_address: ipAddress,
      },
    },
  };

  const response = await fetch(`${supabaseUrl}/rest/v1/${ANALYTICS_TABLE}`, {
    method: "POST",
    headers: {
      apikey: serviceRoleKey,
      Authorization: `Bearer ${serviceRoleKey}`,
      "Content-Type": "application/json",
      Prefer: "return=minimal",
    },
    body: JSON.stringify(insertPayload),
    cache: "no-store",
  });

  if (!response.ok) {
    const errorText = await response.text().catch(() => "");
    return Response.json(
      {
        error: "Failed to store analytics event.",
        details: errorText.slice(0, 500) || null,
      },
      { status: 502 },
    );
  }

  return Response.json({ ok: true });
}
