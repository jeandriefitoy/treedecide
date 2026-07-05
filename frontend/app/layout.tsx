import type { Metadata } from "next";
import "./globals.css";
import "@xyflow/react/dist/style.css";

export const metadata: Metadata = {
  title: "TreeDecide — SPK Decision Tree",
  description:
    "Sistem Pendukung Keputusan berbasis Decision Tree dengan auto-pemilihan algoritma ID3/C4.5",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="id">
      <body>
        <header className="border-b border-gray-200 bg-white">
          <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-4">
            <a href="/" className="text-xl font-bold text-primary-700">
              TreeDecide
            </a>
            <nav className="flex gap-4 text-sm text-gray-600">
              <a href="/" className="hover:text-primary-600">
                Upload
              </a>
              <a href="/configure" className="hover:text-primary-600">
                Konfigurasi
              </a>
              <a href="/result" className="hover:text-primary-600">
                Hasil
              </a>
            </nav>
          </div>
        </header>
        <main className="mx-auto max-w-6xl px-4 py-8">{children}</main>
      </body>
    </html>
  );
}
