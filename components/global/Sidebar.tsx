import { AppSidebar } from "@/components/global/app-sidebar";
import { SidebarProvider } from "@/components/ui/sidebar";
import { ScrollArea } from "@/components/ui/scroll-area";

export function Page({ children }: { children: React.ReactNode }) {
  return (
    <SidebarProvider>
      <AppSidebar />
      <ScrollArea className="h-screen w-full flex flex-1 flex-col p-4 pt-0">
        {children}
      </ScrollArea>
    </SidebarProvider>
  );
}
