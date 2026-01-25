import "./globals.css"
import { Inter, Sora } from "next/font/google"
import { AuthProvider } from "@/context/AuthContext"
import Navbar from "@/components/Navbar"
import { SimulacraProvider } from "@/context/SimulacraContext"

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
  title: "Tower Hub",
  description: "Database & tools for Tower of Fantasy",
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
          <Navbar />
          {children}
          </SimulacraProvider>
        </AuthProvider>
      </body>
    </html>
  )
}
