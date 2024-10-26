"use client"
import { WebSocketProvider } from "@/hooks/interviewersocket/webSocketContext"

export default function InterviewLayout({ children }: { children: React.ReactNode }) {
    return (
        <WebSocketProvider>
            <div className="h-custom bg-primary-foreground flex items-center md:justify-center justify-top w-full" >
                {children}
            </div>
        </WebSocketProvider>
    )
}