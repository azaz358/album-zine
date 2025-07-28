import type { Metadata } from 'next'
import { Roboto_Mono } from 'next/font/google'
import './globals.css'
import Layout from '@/components/Layout'

const robotoMono = Roboto_Mono({ 
  subsets: ['latin'],
  weight: ['100', '300', '400', '500', '700'],
  variable: '--font-roboto-mono',
  display: 'swap',
})

export const metadata: Metadata = {
  title: 'a music zine for friends <3',
  description: 'A community platform for sharing album recommendations and creating beautiful album pages.',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={`${robotoMono.variable} font-mono antialiased`}>
        <Layout>
          {children}
        </Layout>
      </body>
    </html>
  )
}
