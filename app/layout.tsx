import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'KIT DIGITAL "FAMÍLIA IMUNE"',
  description: 'Proteja toda sua família agora',
  generator: 'ImuneDigital',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}
