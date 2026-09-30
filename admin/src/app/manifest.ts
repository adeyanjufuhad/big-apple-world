import type { MetadataRoute } from "next";

// Lets the owner "Add to Home Screen" and open the admin like an app.
export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Big Apple Admin",
    short_name: "BA Admin",
    description: "Manage products, categories and orders for Big Apple World.",
    start_url: "/",
    display: "standalone",
    background_color: "#f7f6f3",
    theme_color: "#3d3e91",
    icons: [
      { src: "/icon-192.png", sizes: "192x192", type: "image/png" },
      { src: "/icon-512.png", sizes: "512x512", type: "image/png" },
    ],
  };
}
