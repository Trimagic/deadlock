import type { Metadata, Viewport } from "next";
import { headers } from "next/headers";
import "@fontsource-variable/manrope";
import "@fontsource-variable/oswald";
import "./globals.css";

export async function generateMetadata(): Promise<Metadata> {
  const requestHeaders = await headers();
  const host = requestHeaders.get("x-forwarded-host") ?? requestHeaders.get("host") ?? "localhost:5173";
  const protocol = requestHeaders.get("x-forwarded-proto") ?? (host.startsWith("localhost") ? "http" : "https");
  const baseUrl = new URL(`${protocol}://${host}`);
  const title = "Deadlock — предметы и контрпики";
  const description = "Мобильный справочник Deadlock: предметы, улучшения и советы по противодействию.";

  return {
    metadataBase: baseUrl,
    title,
    description,
    manifest: "/manifest.webmanifest",
    icons: { icon: [{ url: "/favicon.ico", sizes: "any" }], apple: "/pwa-192.png" },
    openGraph: {
      type: "website",
      locale: "ru_RU",
      siteName: "Deadlock — предметы и контрпики",
      title,
      description,
      images: [{ url: "/social-preview.png", width: 1200, height: 630, alt: "Deadlock — предметы, контрпики и улучшения" }],
    },
    twitter: { card: "summary_large_image", title, description, images: ["/social-preview.png"] },
  };
}
export const viewport: Viewport = { width: "device-width", initialScale: 1, themeColor: "#101112" };
export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="ru"><body>{children}</body></html>;
}
