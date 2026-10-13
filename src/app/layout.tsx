import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Land a $120K+ Data Privacy Career | DataVerse Solutions",
  description:
    "Learn the DataVerse career transition blueprint for a $120K+ Data Privacy role, plus join the free live masterclass on Saturday, October 17th at 12:00 PM Eastern Time, 9:00 AM Pacific Time.",
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
