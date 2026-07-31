import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "DAWDI CAFE",
    short_name: "DAWDI",
    description: "Premium coffee, crêpes, snacks and quality drinks in Morocco.",
    start_url: "/",
    display: "standalone",
    background_color: "#fafafa",
    theme_color: "#ff6b00",
    icons: [{ src: "/logo/logo.png", sizes: "512x512", type: "image/png" }],
  };
}
