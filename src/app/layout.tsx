import type { Metadata } from 'next'
import { MantineProvider } from '@mantine/core'
import { Notifications } from '@mantine/notifications'
import './globals.css'
import '@mantine/core/styles.css'
import '@mantine/notifications/styles.css'
import '@mantine/dates/styles.css'

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
      <body>
        <MantineProvider>
          <Notifications />
          {children}
        </MantineProvider>
      </body>
    </html>
  )
}
