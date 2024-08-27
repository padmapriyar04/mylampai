
import { Open_Sans } from "next/font/google";

const openSans = Open_Sans({ subsets: ["latin"] });

export const metadata = {
  title: 'Not Found - MyLamp-AI',
  description: 'Not found page of MyLamp AI',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={`${openSans.className} bg-primary`}>{children}</body>
    </html>
  )
}
