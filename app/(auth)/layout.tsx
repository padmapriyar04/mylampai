import type { Metadata } from "next";;
import { Open_Sans } from "next/font/google";
import "../globals.css";
import AuthProvider from "@/components/auth/AuthProvider";
import { Toaster } from "@/components/ui/sonner";

const openSans = Open_Sans({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "MyLampAi - Login",
  description: "MyLampAi - Login Page",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full">

      <body className={`${openSans.className} h-full overflow-hidden`}>
        <Toaster />
        <main className="h-full">
          <AuthProvider>{children}</AuthProvider>
        </main>
      </body>
    </html>
  );
}
