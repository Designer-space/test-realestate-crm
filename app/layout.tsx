import type { Metadata } from 'next'
import { Poppins, Roboto } from 'next/font/google'
import './globals.css'
import Sidebar from '@/components/Sidebar'

const poppins = Poppins({
  subsets: ['latin'],
  weight: ['600', '700'],
  variable: '--font-poppins',
})

const roboto = Roboto({
  subsets: ['latin'],
  weight: ['400', '700'],
  variable: '--font-roboto',
})

export const metadata: Metadata = {
  title: 'Aspect CRM — Infrastructure & Construction',
  description: 'Real Estate CRM Admin Panel for Aspect Global Ventures',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" className={`${poppins.variable} ${roboto.variable}`}>
      <body className="min-h-screen bg-[#0f1320] text-white">
        <Sidebar />
        <main className="ml-64 p-8">
          {children}
        </main>
      </body>
    </html>
  )
}
