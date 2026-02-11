import { Button } from "@/components/ui/Button"
import { ArrowRight } from "lucide-react"

export default function Home() {
  return (
    <div className="min-h-screen bg-muted font-sans flex items-center justify-center">
      <main className="w-full max-w-4xl bg-white rounded-card px-10 py-16 flex flex-col items-center text-center gap-10">
        {/* Logo */}
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 bg-primary rounded-full flex items-center justify-center">
            <span className="text-white font-bold text-lg">Q</span>
          </div>
          <h1 className="text-xl font-bold text-foreground">Quanty</h1>
        </div>

        {/* Headline */}
        <div className="max-w-2xl space-y-4">
          <h2 className="text-3xl font-extrabold text-foreground leading-tight">
            Simple POS,
            <br /> built for fast and accurate selling
          </h2>
          <p className="text-gray-500 text-lg leading-relaxed">
            Record sales, manage products, and track your business performance
            in one clean, reliable POS system.
          </p>
        </div>

        {/* Actions */}
        <div className="flex gap-4 flex-col sm:flex-row">
          <Button size="lg" href="/dashboard">
            Open Dashboard
            <ArrowRight className="w-5 h-5 ml-1" />
          </Button>

          <Button variant="outline" size="lg">
            View Demo
          </Button>
        </div>

        {/* Footer note */}
        <p className="text-sm text-gray-400">
          Built for UMKM, retail stores, cafés, and growing businesses.
        </p>
      </main>
    </div>
  )
}
