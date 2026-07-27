import type { Metadata } from 'next'
import { Geist } from 'next/font/google'
import './globals.css'
import Sidebar from '@/components/layout/Sidebar'

const geist = Geist({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'CRM Raízes',
  description: 'CRM para produção de pão de mel',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="pt-BR">
      <body className={geist.className}>
        <div className="flex min-h-screen">
          <Sidebar />
          <div className="flex-1 bg-gray-50">
            {children}
          </div>
        </div>
      </body>
    </html>
  )
}
