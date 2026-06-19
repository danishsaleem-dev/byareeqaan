-- Add alt_text column to the media table for image accessibility / SEO
alter table media add column if not exists alt_text text default '';
