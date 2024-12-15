import HomeNavbar from "@/components/home/HomeNavbar";
import Footer from "@/components/global/Footer";
import { ScrollArea } from "@/components/ui/scroll-area";
import BottomNavBar from "@/components/home/BottomNavBar";
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
        <BottomNavBar/>
      </div>
    </>
  );
}
