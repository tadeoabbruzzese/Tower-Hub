import "./globals.css"
import { Inter, Sora } from "next/font/google"
import { AuthProvider } from "@/context/AuthContext"
import Navbar from "@/components/Navbar"
import { SimulacraProvider } from "@/context/SimulacraContext"
import { NewsProvider } from "@/context/NewsContext"
import { RelicsProvider } from "@/context/RelicsContext"

const inter = Inter({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600"],
  variable: "--font-inter",
})

const sora = Sora({
  subsets: ["latin"],
  weight: ["400", "600", "700"],
  variable: "--font-sora",
})

export const metadata = {
  metadataBase: new URL("https://towerhub.online"),
  title: {
    default: "Tower Hub | Tower of Fantasy Database, Tier List & News",
    template: "%s | Tower Hub",
  },
  description:
    "Tower Hub is an unofficial Tower of Fantasy database and resource hub featuring simulacra, relics, tier lists, updates, and curated game information.",
  applicationName: "Tower Hub",
  keywords: [
    "Tower Hub",
    "Tower of Fantasy database",
    "Tower of Fantasy tier list",
    "Tower of Fantasy simulacra",
    "Tower of Fantasy relics",
    "Tower of Fantasy news",
    "Tower of Fantasy builds",
    "Tower of Fantasy guides",
    "Tower of Fantasy wiki",
  ],
  category: "gaming",
  alternates: {
    canonical: "/",
  },
  icons: {
    icon: [
      { url: "/favicon.ico" },
      { url: "/favicon-16x16.png", sizes: "16x16", type: "image/png" },
      { url: "/favicon-32x32.png", sizes: "32x32", type: "image/png" },
    ],
    apple: [
      { url: "/apple-touch-icon.png", sizes: "180x180", type: "image/png" },
    ],
    shortcut: ["/favicon.ico"],
  },
  manifest: "/site.webmanifest",
  openGraph: {
    type: "website",
    url: "https://towerhub.online",
    siteName: "Tower Hub",
    title: "Tower Hub | Tower of Fantasy Database, Tier List & News",
    description:
      "Explore an unofficial Tower of Fantasy hub with simulacra data, relic details, tier lists, updates, and curated game resources.",
    images: [
      {
        url: "/images/banner.jpg",
        width: 1200,
        height: 630,
        alt: "Tower Hub banner",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Tower Hub | Tower of Fantasy Database, Tier List & News",
    description:
      "Unofficial Tower of Fantasy database and resource hub with simulacra, relics, tier lists, and game updates.",
    images: ["/images/banner.jpg"],
  },
  robots: {
    index: true,
    follow: true,
  },
}

export default function RootLayout({ children }) {
  return (
    <html
      lang="en"
      className={`${inter.variable} ${sora.variable} scroll-smooth`}
    >
      <body className="antialiased bg-[#020617] text-white">
        <AuthProvider>
          <SimulacraProvider>
          <RelicsProvider>
            <NewsProvider>
          <Navbar />
          {children}
          </NewsProvider>
          </RelicsProvider>
          </SimulacraProvider>
        </AuthProvider>
      </body>
    </html>
  )
}
