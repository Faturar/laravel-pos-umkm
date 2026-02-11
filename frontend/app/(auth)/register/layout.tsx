import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Register - POSify",
  description:
    "Create an admin account to set up your store and start using POSify",
}

export default function RegisterLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <>{children}</>
}
