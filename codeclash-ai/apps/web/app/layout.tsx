import "./globals.css";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "CodeClash AI",
  description: "1v1 Python coding battle platform"
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <main className="mx-auto max-w-5xl p-6">{children}</main>
      </body>
    </html>
  );
}
