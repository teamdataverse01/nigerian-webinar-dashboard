import type { Metadata } from "next";
import { ThankYou } from "@/components/sites/dataverse/thank-you";

export const metadata: Metadata = {
  title: "You're Registered | DataVerse Solutions",
  description: "Your seat for the free Data Privacy Career Masterclass is saved.",
  robots: { index: false },
};

export default function ThankYouPage() {
  return <ThankYou />;
}
