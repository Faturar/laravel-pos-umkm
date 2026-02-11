"use client"

import { useRouter } from "next/navigation"
import { ComboForm } from "@/components/forms/ComboForm"
import { PageHeader } from "@/components/dashboard/PageHeader"
import { ArrowLeft } from "lucide-react"
import { Button } from "@/components/ui/Button"
import Link from "next/link"

export default function CreateComboPage() {
  const router = useRouter()

  const handleSuccess = () => {
    // Redirect back to combos list after successful creation
    router.push("/combos")
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title="Create Combo"
        description="Add a new product combination or package"
        rightSlot={
          <Link href="/combos">
            <Button variant="outline">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Combos
            </Button>
          </Link>
        }
      />

      <div className="mx-auto">
        <ComboForm onSuccess={handleSuccess} />
      </div>
    </div>
  )
}
