import type { Metadata } from "next";
import { GalleryPageClient } from "./GalleryPageClient";

export const metadata: Metadata = {
  title: "Gallery",
  description: "Explore our visual stories — coffee, crêpes, atmosphere, and moments at DAWDI CAFE.",
};

export default function GalleryPage() {
  return <GalleryPageClient />;
}
