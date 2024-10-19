

export default async function InterviewLayout({ children }: { children: React.ReactNode }) {
    return (
        <div className="md:h-[calc(100vh-4rem)] h-[132vh] overflow-y-scroll bg-primary-foreground flex items-center md:justify-center justify-top w-full border-[#eeeeee] " >
            {children}
        </div>
    )
}