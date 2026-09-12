import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "RemoteDeck",
    short_name: "RemoteDeck",
    description: "A simple remote control for your PC media player.",
    id: "/",
    start_url: "/",
    scope: "/",
    display: "standalone",
    lang: "en",
    background_color: "#08111f",
    theme_color: "#08111f",
    orientation: "portrait",
    categories: ["utilities", "music", "video"],
    prefer_related_applications: false,
    icons: [
      {
        src: "/icon",
        sizes: "512x512",
        type: "image/png",
        purpose: "any",
      },
      {
        src: "/icon",
        sizes: "512x512",
        type: "image/png",
        purpose: "maskable",
      },
    ],
  };
}
