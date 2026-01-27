import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { ToastProvider } from "./providers/ToastProvider";
import Footer from "./(app)/components/Footer";

const inter = Inter({
  subsets: ["latin"],
});
export const metadata: Metadata = {
  title: "BJJ Mat | Train Anywhere",
  description:
    "BJJ Mat lets Brazilian Jiu-Jitsu athletes find gyms, book drop-ins, sign waivers, and train anywhere in the world — no memberships required.",
};
export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={`${inter.className} bg-neutral-100`}>
        <ToastProvider />

        <div className="flex min-h-screen flex-col">
          {/* Main content */}
          <main className="flex-1">{children}</main>

          {/* Footer */}
          <Footer />
        </div>
      </body>
    </html>
  );
}
