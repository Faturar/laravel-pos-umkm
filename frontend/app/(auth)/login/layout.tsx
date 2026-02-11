import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Login – AgriDash",
  description:
    "Sign in to AgriDash to manage crops, yields, and farm operations",
}

export default function LoginLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <>{children}</>
}
