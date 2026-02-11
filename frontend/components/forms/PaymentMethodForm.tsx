"use client"

import { useState } from "react"
import { PaymentMethod } from "@/types/payment-method"
import { Button } from "@/components/ui/Button"
import { Input } from "@/components/ui/Input"
import { Label } from "@/components/ui/Label"
import {
  Select,
  SelectTrigger,
  SelectContent,
  SelectItem,
  SelectValue,
} from "@/components/ui/Select"
import { Switch } from "@/components/ui/Switch"

interface PaymentMethodFormProps {
  paymentMethod?: PaymentMethod
  onSubmit: (data: Partial<PaymentMethod>) => void
  onCancel: () => void
}

export function PaymentMethodForm({
  paymentMethod,
  onSubmit,
  onCancel,
}: PaymentMethodFormProps) {
  const [formData, setFormData] = useState<Partial<PaymentMethod>>({
    name: paymentMethod?.name || "",
    type: paymentMethod?.type || "Cash",
    fee_type: paymentMethod?.fee_type || "None",
    fee_value: paymentMethod?.fee_value || 0,
    is_default: paymentMethod?.is_default || false,
    is_active: paymentMethod?.is_active ?? true,
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSubmit(formData)
  }

  const handleInputChange = (
    field: keyof PaymentMethod,
    value: string | number | boolean,
  ) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }))
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="name">Method Name</Label>
        <Input
          id="name"
          value={formData.name}
          onChange={(e) => handleInputChange("name", e.target.value)}
          placeholder="Enter payment method name"
          required
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="type">Method Type</Label>
        <Select
          value={formData.type}
          onValueChange={(value) =>
            handleInputChange("type", value as PaymentMethod["type"])
          }
        >
          <SelectTrigger>
            <SelectValue placeholder="Select method type" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="Cash">Cash</SelectItem>
            <SelectItem value="QRIS">QRIS</SelectItem>
            <SelectItem value="E-Wallet">E-Wallet</SelectItem>
            <SelectItem value="Bank Transfer">Bank Transfer</SelectItem>
            <SelectItem value="Credit Card">Credit Card</SelectItem>
            <SelectItem value="Debit Card">Debit Card</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <Label htmlFor="fee_type">Fee Type</Label>
        <Select
          value={formData.fee_type}
          onValueChange={(value) =>
            handleInputChange("fee_type", value as PaymentMethod["fee_type"])
          }
        >
          <SelectTrigger>
            <SelectValue placeholder="Select fee type" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="None">None</SelectItem>
            <SelectItem value="Fixed Amount">Fixed Amount</SelectItem>
            <SelectItem value="Percentage">Percentage</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {formData.fee_type !== "None" && (
        <div className="space-y-2">
          <Label htmlFor="fee_value">
            Fee Value ({formData.fee_type === "Fixed Amount" ? "Rp" : "%"})
          </Label>
          <Input
            id="fee_value"
            type="number"
            step="0.01"
            min="0"
            value={formData.fee_value}
            onChange={(e) =>
              handleInputChange("fee_value", parseFloat(e.target.value) || 0)
            }
            placeholder={
              formData.fee_type === "Fixed Amount"
                ? "Enter fee amount"
                : "Enter fee percentage"
            }
            required
          />
        </div>
      )}

      <div className="flex items-center justify-between">
        <div className="space-y-0.5">
          <Label htmlFor="is_default">Set as Default</Label>
          <p className="text-xs text-gray-500">
            This will be the default payment method for new transactions
          </p>
        </div>
        <Switch
          id="is_default"
          checked={formData.is_default}
          onCheckedChange={(checked) =>
            handleInputChange("is_default", checked)
          }
        />
      </div>

      <div className="flex items-center justify-between">
        <div className="space-y-0.5">
          <Label htmlFor="is_active">Status</Label>
          <p className="text-xs text-gray-500">
            Enable or disable this payment method
          </p>
        </div>
        <Switch
          id="is_active"
          checked={formData.is_active}
          onCheckedChange={(checked) => handleInputChange("is_active", checked)}
        />
      </div>

      <div className="flex justify-end gap-3 pt-4">
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="submit">
          {paymentMethod ? "Update" : "Save"} Payment Method
        </Button>
      </div>
    </form>
  )
}
