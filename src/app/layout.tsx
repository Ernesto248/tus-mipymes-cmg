import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"

export const runtime = "nodejs"

const inter = Inter({
  variable: "--font-sans",
  subsets: ["latin"],
  weight: ["300", "400", "600", "700"],
})

export const metadata: Metadata = {
  title: "SocioPlus - Apoya tu comercio local",
  description:
    "Descubre las mejores pymes de tu ciudad, compara precios y accede a beneficios exclusivos con tu membresia.",
  metadataBase: new URL("https://socioplus.leonardsolutions.dev"),
  icons: {
    icon: "/icon.svg",
    shortcut: "/icon.svg",
    apple: "/icon.svg",
  },
  openGraph: {
    title: "SocioPlus - Apoya tu comercio local",
    description:
      "Descubre las mejores pymes de tu ciudad, compara precios y accede a beneficios exclusivos con tu membresia.",
    images: ["/icon.svg"],
  },
  twitter: {
    card: "summary",
    title: "SocioPlus - Apoya tu comercio local",
    description:
      "Descubre las mejores pymes de tu ciudad, compara precios y accede a beneficios exclusivos con tu membresia.",
    images: ["/icon.svg"],
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="es" className={`${inter.variable}`}>
      <body className="min-h-screen bg-[--color-background] text-[--color-foreground] font-sans antialiased">
        {children}
      </body>
    </html>
  )
}
