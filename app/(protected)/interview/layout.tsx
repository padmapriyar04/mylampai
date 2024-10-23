

export default async function InterviewLayout({ children }: { children: React.ReactNode }) {
    return (
        <div className="h-custom bg-primary-foreground flex items-center md:justify-center justify-top w-full" >
            {children}
        </div>
    )
}