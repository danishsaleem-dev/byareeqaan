import { listTestimonials } from "@/lib/testimonials";
import { AdminTestimonialsManager } from "@/components/admin/AdminTestimonialsManager";

export const dynamic = "force-dynamic";

export default async function AdminTestimonialsPage() {
  const testimonials = await listTestimonials();
  return <AdminTestimonialsManager initial={testimonials} />;
}
