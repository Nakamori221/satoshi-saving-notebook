import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'さとし貯金ノート',
  description: 'ビットコイン積立アプリ',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="ja">
      <body>{children}</body>
    </html>
  )
}
