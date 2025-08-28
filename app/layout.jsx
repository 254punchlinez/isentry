import "./globals.css"
import { ThemeProvider } from "@/components/theme-provider"
import { Providers } from "@/components/providers"

export const metadata = {
  title: "ISentry Dashboard",
  description: "Professional Mini-Dashboard for ISentry Technologies",
  generator: "v0.app",
}

export default function RootLayout({ children }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        {/* Add Geist Sans and Mono fonts from Vercel CDN */}
        <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Geist+Sans:wght@400;700&family=Geist+Mono:wght@400;700&display=swap" />
      </head>
      <body className="font-sans">
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem={true} storageKey="dashboard-theme">
          <Providers>{children}</Providers>
        </ThemeProvider>
      </body>
    </html>
  )
}
