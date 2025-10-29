import './globals.css'
import { Inter, Raleway } from 'next/font/google'

const inter = Inter({ subsets: ['latin'] })
const raleway = Raleway({ subsets: ['latin'] })

export const metadata = {
  title: 'Pickle Near Me',
  description: 'Find the fashion rentals near you',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={`${inter.className} ${raleway.className}`}>{children}</body>
    </html>
  )
}