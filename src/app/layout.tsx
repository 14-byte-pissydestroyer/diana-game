import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Путь Дианы',
  description: 'Интерактивная пиксельная визуальная новелла',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="ru">
      <body className="bg-[#0a0a1a] font-pixel text-white overflow-hidden fixed inset-0">
        <div className="scanline w-full h-full relative">
          {children}
        </div>
      </body>
    </html>
  )
}
