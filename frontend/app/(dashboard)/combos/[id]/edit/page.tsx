"use client"

import { useRouter } from "next/navigation"
import { ComboForm } from "@/components/forms/ComboForm"
import { PageHeader } from "@/components/dashboard/PageHeader"
import { ArrowLeft } from "lucide-react"
import { Button } from "@/components/ui/Button"
import Link from "next/link"
import { ComboFormData } from "@/types/combo"

interface ComboEditPageProps {
  params: {
    id: string
  }
}

// Mock data - in a real app, this would come from an API call
const mockCombo: ComboFormData = {
  name: "Coffee & Croissant Combo",
  price: 145000,
  is_active: true,
  outlet_id: 1,
  items: [
    {
      product_id: 1,
      qty: 1,
    },
    {
      product_id: 3,
      qty: 1,
    },
  ],
}

export default function ComboEditPage({ params }: ComboEditPageProps) {
  const router = useRouter()
  const comboId = parseInt(params.id)

  // In a real app, we would fetch the combo data based on the ID
  const combo = mockCombo

  const handleSuccess = () => {
    // Redirect back to combos list after successful update
    router.push("/combos")
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title="Edit Combo"
        description="Update combo information and composition"
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
        <ComboForm initialData={combo} onSuccess={handleSuccess} />
      </div>
    </div>
  )
}
