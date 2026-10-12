import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Land a $120K+ Data Privacy Career in 90 Days Without Writing a Single Line of Code (Or Starting Over From Scratch)",
  description:
    "Learn the exact transition blueprint used by professionals from Tech, Compliance, Legal, HR, Finance, and Operations to break into one of the highest-paying, most secure niches in tech.",
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
