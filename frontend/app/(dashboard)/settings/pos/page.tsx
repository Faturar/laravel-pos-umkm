"use client"

import { useState, useEffect } from "react"
import { Card } from "@/components/ui/Card"
import { Button } from "@/components/ui/Button"
import { Input } from "@/components/ui/Input"
import { Label } from "@/components/ui/Label"
import { Textarea } from "@/components/ui/Textarea"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/Select"
import { Switch } from "@/components/ui/Switch"
import { PageHeader } from "@/components/dashboard/PageHeader"
import { settingService } from "@/lib/api/setting"
import { Setting, POSSetting } from "@/types/setting"
import { ArrowLeft, Save } from "lucide-react"
import Link from "next/link"

export default function POSSettingsPage() {
  const [settings, setSettings] = useState<Setting[]>([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)

  // Form state
  const [formData, setFormData] = useState({
    storeName: "",
    storeAddress: "",
    phoneNumber: "",
    email: "",
    currency: "IDR",
    timezone: "Asia/Jakarta",
    enableTax: false,
    taxPercentage: 0,
    enableServiceCharge: false,
    serviceChargePercentage: 0,
    applyTaxBeforeServiceCharge: false,
    showLogoOnReceipt: true,
    showTaxBreakdown: true,
    showServiceChargeBreakdown: true,
    footerMessage: "Thank you for your purchase!",
    printCustomerName: true,
    printCashierName: true,
  })

  useEffect(() => {
    fetchPOSSettings()
  }, [])

  const fetchPOSSettings = async () => {
    try {
      setLoading(true)
      setError(null)
      const response = await settingService.getPOSSettings()
      setSettings(response.data || [])

      // Convert settings array to form data
      const settingsData = response.data || []
      const newFormData = { ...formData }

      settingsData.forEach((setting) => {
        switch (setting.key) {
          case "store_name":
            newFormData.storeName = setting.value
            break
          case "store_address":
            newFormData.storeAddress = setting.value
            break
          case "phone_number":
            newFormData.phoneNumber = setting.value
            break
          case "email":
            newFormData.email = setting.value
            break
          case "currency":
            newFormData.currency = setting.value
            break
          case "timezone":
            newFormData.timezone = setting.value
            break
          case "enable_tax":
            newFormData.enableTax = setting.value === "1"
            break
          case "tax_percentage":
            newFormData.taxPercentage = parseFloat(setting.value) || 0
            break
          case "enable_service_charge":
            newFormData.enableServiceCharge = setting.value === "1"
            break
          case "service_charge_percentage":
            newFormData.serviceChargePercentage = parseFloat(setting.value) || 0
            break
          case "apply_tax_before_service_charge":
            newFormData.applyTaxBeforeServiceCharge = setting.value === "1"
            break
          case "show_logo_on_receipt":
            newFormData.showLogoOnReceipt = setting.value === "1"
            break
          case "show_tax_breakdown":
            newFormData.showTaxBreakdown = setting.value === "1"
            break
          case "show_service_charge_breakdown":
            newFormData.showServiceChargeBreakdown = setting.value === "1"
            break
          case "receipt_footer_message":
            newFormData.footerMessage = setting.value
            break
          case "print_customer_name":
            newFormData.printCustomerName = setting.value === "1"
            break
          case "print_cashier_name":
            newFormData.printCashierName = setting.value === "1"
            break
        }
      })

      setFormData(newFormData)
    } catch (err) {
      setError("Failed to fetch POS settings")
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value, type } = e.target

    if (type === "checkbox") {
      const checked = (e.target as HTMLInputElement).checked
      setFormData((prev) => ({
        ...prev,
        [name]: checked,
      }))
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: value,
      }))
    }
  }

  const handleSelectChange = (name: string, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const handleSwitchChange = (name: string, checked: boolean) => {
    setFormData((prev) => ({
      ...prev,
      [name]: checked,
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    setSaving(true)
    setError(null)
    setSuccess(null)

    try {
      // Convert form data back to settings array
      const settingsToUpdate = [
        { key: "store_name", value: formData.storeName },
        { key: "store_address", value: formData.storeAddress },
        { key: "phone_number", value: formData.phoneNumber },
        { key: "email", value: formData.email },
        { key: "currency", value: formData.currency },
        { key: "timezone", value: formData.timezone },
        { key: "enable_tax", value: formData.enableTax ? "1" : "0" },
        { key: "tax_percentage", value: formData.taxPercentage.toString() },
        {
          key: "enable_service_charge",
          value: formData.enableServiceCharge ? "1" : "0",
        },
        {
          key: "service_charge_percentage",
          value: formData.serviceChargePercentage.toString(),
        },
        {
          key: "apply_tax_before_service_charge",
          value: formData.applyTaxBeforeServiceCharge ? "1" : "0",
        },
        {
          key: "show_logo_on_receipt",
          value: formData.showLogoOnReceipt ? "1" : "0",
        },
        {
          key: "show_tax_breakdown",
          value: formData.showTaxBreakdown ? "1" : "0",
        },
        {
          key: "show_service_charge_breakdown",
          value: formData.showServiceChargeBreakdown ? "1" : "0",
        },
        { key: "receipt_footer_message", value: formData.footerMessage },
        {
          key: "print_customer_name",
          value: formData.printCustomerName ? "1" : "0",
        },
        {
          key: "print_cashier_name",
          value: formData.printCashierName ? "1" : "0",
        },
      ]

      // Update each setting
      for (const setting of settings) {
        const settingToUpdate = settingsToUpdate.find(
          (s) => s.key === setting.key,
        )
        if (settingToUpdate && settingToUpdate.value !== setting.value) {
          await settingService.updateSetting(setting.id, {
            key: setting.key,
            value: settingToUpdate.value,
            description: setting.description,
          })
        }
      }

      setSuccess("POS settings updated successfully")
      // Refresh settings
      fetchPOSSettings()
    } catch (err) {
      setError("Failed to update POS settings")
      console.error(err)
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div>Loading POS settings...</div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title="POS Settings"
        description="Configure point of sale settings"
        rightSlot={
          <Link href="/settings">
            <Button variant="outline" size="sm">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Settings
            </Button>
          </Link>
        }
      />

      {error && (
        <div className="bg-red-50 border-l-4 border-red-400 p-4">
          <div className="flex">
            <div className="ml-3">
              <p className="text-sm text-red-700">{error}</p>
            </div>
          </div>
        </div>
      )}

      {success && (
        <div className="bg-green-50 border-l-4 border-green-400 p-4">
          <div className="flex">
            <div className="ml-3">
              <p className="text-sm text-green-700">{success}</p>
            </div>
          </div>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Store Information */}
        <Card>
          <div className="p-6">
            <h3 className="text-lg font-semibold mb-4">Store Information</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="storeName">Store Name</Label>
                <Input
                  id="storeName"
                  name="storeName"
                  value={formData.storeName}
                  onChange={handleInputChange}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="phoneNumber">Phone Number</Label>
                <Input
                  id="phoneNumber"
                  name="phoneNumber"
                  value={formData.phoneNumber}
                  onChange={handleInputChange}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleInputChange}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="currency">Currency</Label>
                <Select
                  value={formData.currency}
                  onValueChange={(value) =>
                    handleSelectChange("currency", value)
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="IDR">Indonesian Rupiah (IDR)</SelectItem>
                    <SelectItem value="USD">US Dollar (USD)</SelectItem>
                    <SelectItem value="EUR">Euro (EUR)</SelectItem>
                    <SelectItem value="SGD">Singapore Dollar (SGD)</SelectItem>
                    <SelectItem value="MYR">Malaysian Ringgit (MYR)</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="timezone">Timezone</Label>
                <Select
                  value={formData.timezone}
                  onValueChange={(value) =>
                    handleSelectChange("timezone", value)
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Asia/Jakarta">Jakarta (WIB)</SelectItem>
                    <SelectItem value="Asia/Makassar">
                      Makassar (WITA)
                    </SelectItem>
                    <SelectItem value="Asia/Jayapura">
                      Jayapura (WIT)
                    </SelectItem>
                    <SelectItem value="Asia/Singapore">Singapore</SelectItem>
                    <SelectItem value="Asia/Kuala_Lumpur">
                      Kuala Lumpur
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="mt-4 space-y-2">
              <Label htmlFor="storeAddress">Store Address</Label>
              <Textarea
                id="storeAddress"
                name="storeAddress"
                value={formData.storeAddress}
                onChange={handleInputChange}
                rows={3}
              />
            </div>
          </div>
        </Card>

        {/* Tax & Service Charge */}
        <Card>
          <div className="p-6">
            <h3 className="text-lg font-semibold mb-4">Tax & Service Charge</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <Label htmlFor="enableTax">Enable Tax</Label>
                  <Switch
                    id="enableTax"
                    checked={formData.enableTax}
                    onCheckedChange={(checked) =>
                      handleSwitchChange("enableTax", checked)
                    }
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="taxPercentage">Tax Percentage (%)</Label>
                  <Input
                    id="taxPercentage"
                    name="taxPercentage"
                    type="number"
                    min="0"
                    max="100"
                    value={formData.taxPercentage}
                    onChange={handleInputChange}
                    disabled={!formData.enableTax}
                  />
                </div>
              </div>

              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <Label htmlFor="enableServiceCharge">
                    Enable Service Charge
                  </Label>
                  <Switch
                    id="enableServiceCharge"
                    checked={formData.enableServiceCharge}
                    onCheckedChange={(checked) =>
                      handleSwitchChange("enableServiceCharge", checked)
                    }
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="serviceChargePercentage">
                    Service Charge Percentage (%)
                  </Label>
                  <Input
                    id="serviceChargePercentage"
                    name="serviceChargePercentage"
                    type="number"
                    min="0"
                    max="100"
                    value={formData.serviceChargePercentage}
                    onChange={handleInputChange}
                    disabled={!formData.enableServiceCharge}
                  />
                </div>
              </div>
            </div>

            {formData.enableTax && formData.enableServiceCharge && (
              <div className="mt-4 flex items-center space-x-2">
                <input
                  type="checkbox"
                  id="applyTaxBeforeServiceCharge"
                  checked={formData.applyTaxBeforeServiceCharge}
                  onChange={(e) =>
                    handleSwitchChange(
                      "applyTaxBeforeServiceCharge",
                      e.target.checked,
                    )
                  }
                  className="h-4 w-4"
                />
                <Label htmlFor="applyTaxBeforeServiceCharge">
                  Apply Tax Before Service Charge
                </Label>
              </div>
            )}
          </div>
        </Card>

        {/* Receipt Configuration */}
        <Card>
          <div className="p-6">
            <h3 className="text-lg font-semibold mb-4">
              Receipt Configuration
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex items-center justify-between">
                <Label htmlFor="showLogoOnReceipt">Show Logo on Receipt</Label>
                <Switch
                  id="showLogoOnReceipt"
                  checked={formData.showLogoOnReceipt}
                  onCheckedChange={(checked) =>
                    handleSwitchChange("showLogoOnReceipt", checked)
                  }
                />
              </div>

              <div className="flex items-center justify-between">
                <Label htmlFor="showTaxBreakdown">Show Tax Breakdown</Label>
                <Switch
                  id="showTaxBreakdown"
                  checked={formData.showTaxBreakdown}
                  onCheckedChange={(checked) =>
                    handleSwitchChange("showTaxBreakdown", checked)
                  }
                />
              </div>

              <div className="flex items-center justify-between">
                <Label htmlFor="showServiceChargeBreakdown">
                  Show Service Charge Breakdown
                </Label>
                <Switch
                  id="showServiceChargeBreakdown"
                  checked={formData.showServiceChargeBreakdown}
                  onCheckedChange={(checked) =>
                    handleSwitchChange("showServiceChargeBreakdown", checked)
                  }
                />
              </div>

              <div className="flex items-center justify-between">
                <Label htmlFor="printCustomerName">Print Customer Name</Label>
                <Switch
                  id="printCustomerName"
                  checked={formData.printCustomerName}
                  onCheckedChange={(checked) =>
                    handleSwitchChange("printCustomerName", checked)
                  }
                />
              </div>

              <div className="flex items-center justify-between">
                <Label htmlFor="printCashierName">Print Cashier Name</Label>
                <Switch
                  id="printCashierName"
                  checked={formData.printCashierName}
                  onCheckedChange={(checked) =>
                    handleSwitchChange("printCashierName", checked)
                  }
                />
              </div>
            </div>

            <div className="mt-4 space-y-2">
              <Label htmlFor="footerMessage">Receipt Footer Message</Label>
              <Textarea
                id="footerMessage"
                name="footerMessage"
                value={formData.footerMessage}
                onChange={handleInputChange}
                rows={2}
              />
            </div>
          </div>
        </Card>

        <div className="flex justify-end">
          <Button type="submit" disabled={saving}>
            <Save className="h-4 w-4 mr-2" />
            {saving ? "Saving..." : "Save Settings"}
          </Button>
        </div>
      </form>
    </div>
  )
}
