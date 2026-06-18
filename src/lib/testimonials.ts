import "server-only";
import { supabaseAdmin } from "./supabase";

/* eslint-disable @typescript-eslint/no-explicit-any */

export type SourceType = "whatsapp" | "instagram" | "video" | "text";
export type MediaType = "image" | "video";

export interface Testimonial {
  id: string;
  authorName: string;
  authorHandle: string;
  content: string;
  mediaUrl: string;
  mediaType: MediaType;
  sourceType: SourceType;
  active: boolean;
  sortOrder: number;
  createdAt: string;
}

export type TestimonialInput = Omit<Testimonial, "id" | "createdAt">;

function toTestimonial(r: any): Testimonial {
  return {
    id: r.id,
    authorName: r.author_name,
    authorHandle: r.author_handle ?? "",
    content: r.content ?? "",
    mediaUrl: r.media_url ?? "",
    mediaType: (r.media_type ?? "image") as MediaType,
    sourceType: r.source_type as SourceType,
    active: !!r.active,
    sortOrder: Number(r.sort_order ?? 0),
    createdAt: r.created_at,
  };
}

export async function listTestimonials(activeOnly = false): Promise<Testimonial[]> {
  const sb = supabaseAdmin();
  let q = sb.from("testimonials").select("*").order("sort_order").order("created_at", { ascending: false });
  if (activeOnly) q = q.eq("active", true);
  const { data, error } = await q;
  if (error) throw error;
  return (data ?? []).map(toTestimonial);
}

export async function createTestimonial(input: TestimonialInput): Promise<Testimonial> {
  const sb = supabaseAdmin();
  const { data, error } = await sb
    .from("testimonials")
    .insert({
      author_name: input.authorName,
      author_handle: input.authorHandle || null,
      content: input.content || null,
      media_url: input.mediaUrl || null,
      media_type: input.mediaType,
      source_type: input.sourceType,
      active: input.active,
      sort_order: input.sortOrder,
    })
    .select()
    .single();
  if (error) throw error;
  return toTestimonial(data);
}

export async function updateTestimonial(id: string, input: TestimonialInput): Promise<void> {
  const sb = supabaseAdmin();
  const { error } = await sb
    .from("testimonials")
    .update({
      author_name: input.authorName,
      author_handle: input.authorHandle || null,
      content: input.content || null,
      media_url: input.mediaUrl || null,
      media_type: input.mediaType,
      source_type: input.sourceType,
      active: input.active,
      sort_order: input.sortOrder,
    })
    .eq("id", id);
  if (error) throw error;
}

export async function deleteTestimonial(id: string): Promise<void> {
  const sb = supabaseAdmin();
  const { error } = await sb.from("testimonials").delete().eq("id", id);
  if (error) throw error;
}

export async function setTestimonialActive(id: string, active: boolean): Promise<void> {
  const sb = supabaseAdmin();
  const { error } = await sb.from("testimonials").update({ active }).eq("id", id);
  if (error) throw error;
}
