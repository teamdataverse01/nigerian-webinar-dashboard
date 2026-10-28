import type { Metadata } from "next";
import { Fraunces, Manrope } from "next/font/google";
import { ApplicationForm } from "@/components/sites/dataverse/application-form";
import "./apply.css";

const fraunces = Fraunces({ subsets: ["latin"], variable: "--ap-display", display: "swap" });
const manrope = Manrope({ subsets: ["latin"], variable: "--ap-body", display: "swap" });

export const metadata: Metadata = {
  title: "Apply for a Strategy Call | DataVerse Solutions",
  description: "Answer a few quick questions to see if the 90-day data privacy coaching program is the right fit for you.",
};

export default function ApplyPage() {
  return (
    <div className={`${fraunces.variable} ${manrope.variable}`}>
      <ApplicationForm />
    </div>
  );
}
