import { WebSocketProvider } from "@/hooks/interviewersocket/webSocketContext"

export default async function InterviewLayout({ children }: { children: React.ReactNode }) {
    return (
        <WebSocketProvider>
            {children}
        </WebSocketProvider>
    )
}