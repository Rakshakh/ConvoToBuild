import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'ConvoToBuild - AI-Powered App Builder',
  description: 'Build applications through casual conversation on WhatsApp',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}
