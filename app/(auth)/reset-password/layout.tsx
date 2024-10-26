import { Suspense } from "react"


export default function ResetLayout({children}: {
  children: React.ReactNode
}) {
  return (
    <Suspense>
      {children}
      
    </Suspense>
  )
}