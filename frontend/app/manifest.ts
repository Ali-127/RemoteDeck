import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "RemoteDeck",
    short_name: "RemoteDeck",
    description: "A simple remote control for your PC media player.",
    start_url: "/",
    display: "standalone",
    background_color: "#08111f",
    theme_color: "#08111f",
    orientation: "portrait",
    icons: [
      {
        src: "/icon",
        sizes: "512x512",
        type: "image/png",
        purpose: "maskable",
      },
    ],
  };
}
