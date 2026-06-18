-- Testimonials table
create table if not exists testimonials (
  id          uuid default gen_random_uuid() primary key,
  author_name text not null,
  author_handle text,          -- @instagram handle or "via WhatsApp" etc.
  content     text,            -- the text quote (null for image/video-only)
  media_url   text,            -- uploaded screenshot or video URL
  media_type  text check (media_type in ('image', 'video')) default 'image',
  source_type text not null check (source_type in ('whatsapp', 'instagram', 'video', 'text')) default 'text',
  active      boolean default true,
  sort_order  int default 0,
  created_at  timestamptz default now()
);

-- RLS: public read for active only, no auth needed for reads
alter table testimonials enable row level security;

create policy "Public can read active testimonials"
  on testimonials for select
  using (active = true);
