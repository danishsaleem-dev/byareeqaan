import { SmoothScroll } from "@/components/SmoothScroll";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { BagProvider } from "@/lib/bag";
import { BagDrawer } from "@/components/site/BagDrawer";
import { ToastProvider } from "@/components/site/Toast";

export default function SiteLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="grain">
      <BagProvider>
        <ToastProvider>
          <SmoothScroll>
            <Navbar />
            {children}
            <Footer />
          </SmoothScroll>
          <BagDrawer />
        </ToastProvider>
      </BagProvider>
    </div>
  );
}
