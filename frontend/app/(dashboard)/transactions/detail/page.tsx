import { PageHeader } from "@/components/dashboard/PageHeader"
import { Button } from "@/components/ui/Button"
import {
  Copy,
  Receipt,
  Package,
  Warehouse,
  CreditCard,
  RotateCcw,
  Ban,
  Printer,
  AlertTriangle,
  Notebook,
} from "lucide-react"

/* ================= MOCK DATA ================= */

const transaction = {
  id: "TRX-9A82KD",
  invoice: "INV-20260205-0001",
  status: "completed", // completed | refunded | voided
  datetime: "05 Feb 2026 · 14:32",
  outlet: "Main Outlet",
  cashier: "Andi",
  subtotal: 120000,
  discount: 10000,
  tax: 11000,
  service: 0,
  total: 121000,
  payment: {
    method: "Cash",
    paid: 150000,
    change: 29000,
    reference: null,
  },
}

const items = [
  {
    id: 1,
    name: "Paket Hemat Ayam",
    type: "combo",
    quantity: 1,
    price: 45000,
    subtotal: 45000,
    comboItems: [
      { name: "Ayam Goreng", qty: 1 },
      { name: "Nasi Putih", qty: 1 },
      { name: "Es Teh", qty: 1 },
    ],
  },
  {
    id: 2,
    name: "Nasi Goreng Spesial",
    type: "product",
    quantity: 2,
    price: 25000,
    subtotal: 50000,
  },
]

const inventoryImpact = [
  {
    product: "Ayam Goreng",
    before: 20,
    change: -1,
    after: 19,
  },
  {
    product: "Nasi Goreng Spesial",
    before: 15,
    change: -2,
    after: 13,
  },
]

const notes = {
  transaction_note: "No spicy, extra sambal",
  admin_note: "Customer requested mild taste",
}

const auditLogs = [
  {
    action: "Created",
    by: "Andi",
    time: "05 Feb 2026 · 14:32",
  },
]

/* ================= PAGE ================= */

export default function TransactionDetailPage() {
  return (
    <div className="space-y-6">
      {/* ================= HEADER ================= */}
      <PageHeader
        title="Transaction Detail"
        description={`Transaction ID ${transaction.id}`}
        rightSlot={
          <div className="flex gap-2">
            <Button variant="outline">
              <Printer className="w-4 h-4 mr-2" />
              Reprint
            </Button>
            <Button variant="outline">
              <RotateCcw className="w-4 h-4 mr-2" />
              Refund
            </Button>
            <Button variant="danger">
              <Ban className="w-4 h-4 mr-2" />
              Void
            </Button>
          </div>
        }
      />

      {/* ================= CONTEXT ================= */}
      <section className="bg-white rounded-card border border-border p-6 grid grid-cols-2 md:grid-cols-4 gap-4">
        <Meta label="Transaction ID" value={transaction.id} copyable />
        <Meta label="Status" value={transaction.status.toUpperCase()} />
        <Meta label="Date & Time" value={transaction.datetime} />
        <Meta label="Outlet" value={transaction.outlet} />
        <Meta label="Cashier" value={transaction.cashier} />
        <Meta label="Invoice" value={transaction.invoice} />
      </section>

      {/* ================= SUMMARY ================= */}
      <section className="bg-white rounded-card border border-border p-6 space-y-4">
        <h3 className="text-lg font-semibold flex items-center gap-2">
          <Receipt className="w-5 h-5" /> Transaction Summary
        </h3>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <Stat label="Subtotal" value={rupiah(transaction.subtotal)} />
          <Stat label="Discount" value={`- ${rupiah(transaction.discount)}`} />
          <Stat label="Tax" value={rupiah(transaction.tax)} />
          <Stat label="Service" value={rupiah(transaction.service)} />
          <Stat label="Total Paid" value={rupiah(transaction.total)} strong />
          <Stat label="Payment Method" value={transaction.payment.method} />
          {transaction.payment.method === "Cash" && (
            <>
              <Stat
                label="Paid Amount"
                value={rupiah(transaction.payment.paid)}
              />
              <Stat label="Change" value={rupiah(transaction.payment.change)} />
            </>
          )}
        </div>
      </section>

      {/* ================= ITEMS SOLD ================= */}
      <section className="bg-white rounded-card border border-border p-6 space-y-4">
        <h3 className="text-lg font-semibold flex items-center gap-2">
          <Package className="w-5 h-5" /> Items Sold
        </h3>

        <div className="divide-y divide-border">
          {items.map((item) => (
            <div key={item.id} className="py-4 space-y-2">
              <div className="grid grid-cols-12 gap-4 items-center">
                <div className="col-span-5">
                  <p className="font-medium">{item.name}</p>
                  <span className="text-xs text-gray-500 uppercase">
                    {item.type}
                  </span>
                </div>
                <div className="col-span-2 text-center">{item.quantity}×</div>
                <div className="col-span-2 text-right">
                  {rupiah(item.price)}
                </div>
                <div className="col-span-3 text-right font-semibold">
                  {rupiah(item.subtotal)}
                </div>
              </div>

              {/* COMBO EXPANSION */}
              {item.type === "combo" && item.comboItems && (
                <div className="ml-4 bg-muted rounded-card p-3 space-y-1">
                  {item.comboItems.map((c, i) => (
                    <p
                      key={i}
                      className="text-sm text-gray-600 flex justify-between"
                    >
                      <span>{c.name}</span>
                      <span>{c.qty}×</span>
                    </p>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      </section>

      {/* ================= NOTES & METADATA ================= */}
      <section className="bg-white rounded-card border border-border p-6 space-y-4">
        <h3 className="text-lg font-semibold flex items-center gap-2">
          <Notebook className="w-5 h-5" /> Notes & Metadata
        </h3>

        {notes.transaction_note && (
          <div className="bg-muted rounded-card p-4">
            <p className="text-sm text-gray-500">Transaction Note</p>
            <p className="font-medium text-foreground">
              {notes.transaction_note}
            </p>
          </div>
        )}

        {notes.admin_note && (
          <div className="bg-yellow-50 border border-yellow-200 rounded-card p-4">
            <p className="text-sm text-yellow-700">Internal Admin Note</p>
            <p className="font-medium text-yellow-900">{notes.admin_note}</p>
          </div>
        )}
      </section>

      {/* ================= INVENTORY IMPACT ================= */}
      <section className="bg-white rounded-card border border-border p-6 space-y-4">
        <h3 className="text-lg font-semibold flex items-center gap-2">
          <Warehouse className="w-5 h-5" /> Inventory Impact
        </h3>

        <div className="divide-y divide-border">
          {inventoryImpact.map((row, i) => (
            <div key={i} className="py-3 grid grid-cols-4 text-sm">
              <span>{row.product}</span>
              <span>{row.before}</span>
              <span className="text-red-600">{row.change}</span>
              <span>{row.after}</span>
            </div>
          ))}
        </div>
      </section>

      {/* ================= AUDIT TRAIL ================= */}
      <section className="bg-white rounded-card border border-border p-6 space-y-3">
        <h3 className="text-lg font-semibold">Audit Trail</h3>
        {auditLogs.map((log, i) => (
          <div key={i} className="text-sm text-gray-600">
            {log.action} by <strong>{log.by}</strong> · {log.time}
          </div>
        ))}
      </section>
    </div>
  )
}

/* ================= COMPONENTS ================= */

function Meta({
  label,
  value,
  copyable,
}: {
  label: string
  value: string
  copyable?: boolean
}) {
  return (
    <div>
      <p className="text-xs text-gray-500">{label}</p>
      <div className="flex items-center gap-2">
        <p className="font-medium">{value}</p>
        {copyable && <Copy className="w-4 h-4 text-gray-400" />}
      </div>
    </div>
  )
}

function Stat({
  label,
  value,
  strong,
}: {
  label: string
  value: string
  strong?: boolean
}) {
  return (
    <div className="bg-muted rounded-card p-4">
      <p className="text-sm text-gray-500">{label}</p>
      <p
        className={`${strong ? "text-xl font-bold" : "text-lg font-semibold"}`}
      >
        {value}
      </p>
    </div>
  )
}

function rupiah(v: number) {
  return `Rp ${v.toLocaleString("id-ID")}`
}
