import HomeNavbar from "@/components/home/HomeNavbar";
import Footer from "@/components/home/Footer";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <>
      <HomeNavbar />
      <div className="flex flex-col min-h-screen bg-cover transition-all duration-300">
        {children}
        <Footer />
      </div>
    </>
  );
}
