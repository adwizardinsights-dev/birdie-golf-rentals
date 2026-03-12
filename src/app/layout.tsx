import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "Birdie Golf Rentals | Golf Clubs Delivered To Your Tee Time",
  description: "Rent premium golf clubs and have them delivered to your hotel, Airbnb, or golf course. Easy online booking with instant confirmation.",
  keywords: "golf club rental, golf equipment, rent golf clubs, golf vacation, tee time",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
        {children}
      </body>
    </html>
  )
}
