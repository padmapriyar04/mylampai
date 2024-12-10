import HomeNavbar from "@/components/home/HomeNavbar";
import Footer from "@/components/global/Footer";
import { ScrollArea } from "@/components/ui/scroll-area";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <>
      <HomeNavbar />
      <ScrollArea className="h-screen w-full flex flex-1 flex-col">
        {children}
        <Footer />
      </ScrollArea>
    </>
  );
}
