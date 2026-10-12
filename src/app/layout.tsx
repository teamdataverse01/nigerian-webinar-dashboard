import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Land DPO Deals | DataVerse Solutions",
  description:
    "Free live masterclass, Saturday October 17th at 5:00 PM WAT: how to land ₦700k–₦1.5M/month Data Protection Officer deals in 90 days, even without prior privacy experience.",
  icons: { icon: "/sites/dataverse/DATAVERSELOGO.jpeg" },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
