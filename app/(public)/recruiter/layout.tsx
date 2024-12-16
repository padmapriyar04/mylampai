import HomeNavbar from "@/components/home/HomeNavbar";
import Footer from "@/components/global/Footer";
import BottomNavBar from "@/components/home/BottomNavBar";

export default function RecruiterLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <>
      {/* Recruiter-specific Navbar */}
      <HomeNavbar />

      <div className="min-h-screen w-full flex flex-1 flex-col">
        {children}
      </div>
      
    </>
  );
}
