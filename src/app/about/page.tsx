import type { Metadata } from "next";
import { AboutPageClient } from "./AboutPageClient";

export const metadata: Metadata = {
  title: "About",
  description: "Discover the story behind DAWDI CAFE — premium coffee, quality crêpes, and a warm atmosphere in Morocco.",
};

export default function AboutPage() {
  return <AboutPageClient />;
}
