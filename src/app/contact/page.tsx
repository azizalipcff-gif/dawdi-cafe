import type { Metadata } from "next";
import { ContactPageClient } from "./ContactPageClient";

export const metadata: Metadata = {
  title: "Contact",
  description: "Get in touch with DAWDI CAFE. Visit us, call, or send a message.",
};

export default function ContactPage() {
  return <ContactPageClient />;
}
