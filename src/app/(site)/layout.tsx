import { SmoothScroll } from "@/components/SmoothScroll";

export default function SiteLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="grain">
      <SmoothScroll>{children}</SmoothScroll>
    </div>
  );
}
