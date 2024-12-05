import { AppSidebar } from "@/components/global/app-sidebar";
import { SidebarProvider } from "@/components/ui/sidebar";

export function Page({ children }: { children: React.ReactNode }) {
  return (
    <SidebarProvider>
      <AppSidebar />
      <div className="w-full flex flex-1 flex-col p-4 pt-0">{children}</div>
    </SidebarProvider>
  );
}
