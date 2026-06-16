import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Admin · By Areeqaan",
  robots: { index: false, follow: false },
};

export default function AdminRootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-[#f6f5f8] font-sans text-[#241627]">
      {children}
    </div>
  );
}
