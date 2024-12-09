import { AppSidebar } from "@/components/global/app-sidebar";
import { ScrollArea } from "@/components/ui/scroll-area";

export function Page({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex">
      <AppSidebar />
      <ScrollArea className="h-screen w-full flex flex-1 flex-col">
        {children}
      </ScrollArea>
    </div>
  );
}
