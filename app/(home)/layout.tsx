import "./../globals.css";
import { Open_Sans } from "next/font/google";
import HomeNavbar from "@/components/home/HomeNavbar";
import Footer from "@/components/home/Footer";
import { Toaster } from "sonner";
import AuthProvider from "@/components/auth/AuthProvider";

const openSans = Open_Sans({ subsets: ["latin"], display: "swap" });

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="scroll-smooth focus:scroll-auto">
      <body className={`${openSans.className}`}>
        <AuthProvider>
        <HomeNavbar />
        <div className="flex flex-col min-h-screen bg-cover transition-all duration-300">
          {children}
          <Footer />
        </div>
        </AuthProvider>
        <Toaster position="top-center" />
      </body>
    </html>
  );
}