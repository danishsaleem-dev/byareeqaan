import { SmoothScroll } from "@/components/SmoothScroll";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { getHomepage } from "@/lib/data";

export default async function SiteLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { announcement } = await getHomepage();

  return (
    <div className="grain">
      <SmoothScroll>
        <Navbar
          announcement={
            announcement.enabled && announcement.text.trim()
              ? announcement.text
              : undefined
          }
        />
        {children}
        <Footer />
      </SmoothScroll>
    </div>
  );
}
