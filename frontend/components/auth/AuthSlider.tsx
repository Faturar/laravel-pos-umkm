"use client"

import Image from "next/image"
import { useState, useEffect, useRef, useCallback } from "react"
import { ArrowLeft, ArrowRight } from "lucide-react"

import { Button } from "@/components/ui/Button"

interface AuthSliderProps {
  interval?: number
}

const slides = [
  {
    image: "https://images.unsplash.com/photo-1604719312566-8912e9227c6a",
    quote:
      "With POSify, our checkout process is faster, inventory is always accurate, and daily reports are ready instantly.",
    name: "Andi Pratama",
    role: "Store Manager",
  },
  {
    image: "https://images.unsplash.com/photo-1601598505513-7489a6272d2a",
    quote:
      "Managing multiple cashiers is now effortless. POSify keeps everything organized in real time.",
    name: "Rina Mahendra",
    role: "Retail Supervisor",
  },
  {
    image: "https://images.unsplash.com/photo-1556740738-b6a63e27c4df",
    quote:
      "Sales tracking and product management became much simpler after switching to POSify.",
    name: "Budi Santoso",
    role: "Business Owner",
  },
]

export function AuthSlider({ interval = 8000 }: AuthSliderProps) {
  const [index, setIndex] = useState(0)
  const timerRef = useRef<NodeJS.Timeout | null>(null)

  const stopAutoSlide = useCallback(() => {
    if (timerRef.current) {
      clearInterval(timerRef.current)
      timerRef.current = null
    }
  }, [])

  const startAutoSlide = useCallback(() => {
    stopAutoSlide()
    timerRef.current = setInterval(() => {
      setIndex((prev) => (prev === slides.length - 1 ? 0 : prev + 1))
    }, interval)
  }, [stopAutoSlide, interval])

  useEffect(() => {
    startAutoSlide()
    return stopAutoSlide
  }, [startAutoSlide, stopAutoSlide])

  const prevSlide = () => {
    stopAutoSlide()
    setIndex((prev) => (prev === 0 ? slides.length - 1 : prev - 1))
    startAutoSlide()
  }

  const nextSlide = () => {
    stopAutoSlide()
    setIndex((prev) => (prev === slides.length - 1 ? 0 : prev + 1))
    startAutoSlide()
  }

  const slide = slides[index]

  return (
    <div className="hidden lg:flex flex-1 absolute right-0 top-0 h-full w-[calc(100%-520px)]">
      {/* IMAGE */}
      <div className="absolute inset-0">
        <Image
          src={slide.image}
          alt="Auth background"
          fill
          priority
          className="object-cover"
        />

        {/* OVERLAY */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-black/10 pointer-events-none" />

        {/* CONTENT */}
        <div className="absolute bottom-0 p-12 text-white max-w-xl">
          <p className="text-2xl font-medium mb-6">“{slide.quote}”</p>
          <div>
            <p className="font-semibold">{slide.name}</p>
            <p className="opacity-80 text-sm">{slide.role}</p>
          </div>
        </div>
      </div>

      {/* CONTROLS */}
      <div className="absolute bottom-8 right-8 flex gap-3 z-10">
        <Button variant="primary" size="sm" onClick={prevSlide}>
          <ArrowLeft className="w-5 h-5" />
        </Button>
        <Button variant="primary" size="sm" onClick={nextSlide}>
          <ArrowRight className="w-5 h-5" />
        </Button>
      </div>
    </div>
  )
}
