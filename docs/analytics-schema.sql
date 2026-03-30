create extension if not exists pgcrypto;

create table if not exists public.analytics_events_chattiphy (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  occurred_at timestamptz not null,
  event_type text not null,
  page_path text not null,
  page_title text,
  session_id text not null,
  visitor_id text not null,
  element_label text,
  element_target text,
  element_type text,
  scroll_percent integer,
  device_type text,
  browser_name text,
  os_name text,
  viewport_width integer,
  viewport_height integer,
  language text,
  referrer text,
  user_agent text,
  metadata jsonb
);

create index if not exists analytics_events_chattiphy_created_at_idx
  on public.analytics_events_chattiphy (created_at desc);

create index if not exists analytics_events_chattiphy_event_type_idx
  on public.analytics_events_chattiphy (event_type);

create index if not exists analytics_events_chattiphy_page_path_idx
  on public.analytics_events_chattiphy (page_path);

create index if not exists analytics_events_chattiphy_session_id_idx
  on public.analytics_events_chattiphy (session_id);

create index if not exists analytics_events_chattiphy_scroll_percent_idx
  on public.analytics_events_chattiphy (scroll_percent);

alter table public.analytics_events_chattiphy enable row level security;
