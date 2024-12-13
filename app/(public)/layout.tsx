import HomeNavbar from "@/components/home/HomeNavbar";
import Footer from "@/components/global/Footer";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <>
      <HomeNavbar />
      <div className="min-h-screen w-full flex flex-1 flex-col">
        {children}
        <Footer />
      </div>
    </>
  );
}
