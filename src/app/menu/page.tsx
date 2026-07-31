import type { Metadata } from "next";
import { MenuPageClient } from "./MenuPageClient";

export const metadata: Metadata = {
  title: "Menu",
  description: "Explore our menu of premium coffee, crêpes, fresh juices, milkshakes, and more.",
};

export default function MenuPage() {
  return <MenuPageClient />;
}
