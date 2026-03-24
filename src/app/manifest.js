export default function manifest() {
  return {
    name: "Tower Hub",
    short_name: "Tower Hub",
    description:
      "Unofficial Tower of Fantasy database and resource hub with simulacra, relics, tier lists, and updates.",
    start_url: "/",
    display: "standalone",
    background_color: "#020617",
    theme_color: "#020617",
    icons: [
      {
        src: "/android-chrome-192x192.png",
        sizes: "192x192",
        type: "image/png",
      },
      {
        src: "/android-chrome-512x512.png",
        sizes: "512x512",
        type: "image/png",
      },
    ],
  }
}
