import './globals.css'
import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import { Toaster } from '@/components/toaster'
import { Providers } from '@/components/providers'

const inter = Inter({ subsets: ['latin'] })


export const metadata: Metadata = {
  title: 'ScrapeFlow - No-Code Web Scraping',
  description: 'A production-ready no-code web scraping platform',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <Providers>
          {children}
          <Toaster />
        </Providers>
      </body>
    </html>
  )
}