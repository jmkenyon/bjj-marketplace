import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { ToastProvider } from "./providers/ToastProvider";
import Footer from "./(app)/components/Footer";

const inter = Inter({
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "BJJ Desk",
  description:
    "BJJ Desk helps Brazilian Jiu-Jitsu gyms manage students, memberships, attendance, and payments — all in one simple platform.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${inter.className} bg-neutral-100`}>
        <ToastProvider />
        {children}
        <Footer />
      </body>
    </html>
  );
}
