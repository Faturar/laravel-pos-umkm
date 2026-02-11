"use client"

import { useState, useEffect } from "react"
import { Card } from "@/components/ui/Card"
import { Button } from "@/components/ui/Button"
import { PageHeader } from "@/components/dashboard/PageHeader"
import { DataTable } from "@/components/ui/DataTable"
import { settingService } from "@/lib/api/setting"
import { Setting } from "@/types/setting"
import { settingColumns } from "./columns"
import { Plus } from "lucide-react"
import Link from "next/link"

export default function SettingsPage() {
  const [settings, setSettings] = useState<Setting[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    fetchSettings()
  }, [])

  const fetchSettings = async () => {
    try {
      setLoading(true)
      setError(null)
      const response = await settingService.getSettings()
      setSettings(response.data || [])
    } catch (err) {
      setError("Failed to fetch settings")
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title="System Settings"
        description="Configure system settings and preferences"
        rightSlot={
          <Link href="/settings/pos">
            <Button>POS Settings</Button>
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

      <Card>
        <div className="p-6">
          {loading ? (
            <div className="flex items-center justify-center h-64">
              <div>Loading settings...</div>
            </div>
          ) : (
            <DataTable
              columns={settingColumns}
              data={settings}
              meta={{
                page: 1,
                per_page: 10,
                total: settings.length,
                total_pages: Math.ceil(settings.length / 10),
              }}
            />
          )}
        </div>
      </Card>
    </div>
  )
}
