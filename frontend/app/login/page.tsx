"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import { useAuth } from "@/lib/auth"
import { useAlertContext } from "@/components/AlertProvider"
import { useRouter } from "next/navigation"
import { z } from "zod"
import { loginSchema, type LoginFormData } from "@/validations/authValidation"

export default function LoginPage() {
  const [showPassword, setShowPassword] = useState(false)
  const [currentSlide, setCurrentSlide] = useState(0)
  const [formData, setFormData] = useState<LoginFormData>({
    email: "",
    password: "",
  })
  const [errors, setErrors] = useState<Record<string, string>>({})

  const { login, isLoading, isAuthenticated } = useAuth()
  const { showError } = useAlertContext()
  const router = useRouter()

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword)
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))

    // Clear error when user starts typing
    if (errors[name]) {
      setErrors((prev) => {
        const newErrors = { ...prev }
        delete newErrors[name]
        return newErrors
      })
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    try {
      // Validate form data
      const validatedData = loginSchema.parse(formData)

      try {
        await login(validatedData)
        // After successful login, the AuthProvider will handle the redirect
        // No need to redirect manually here
      } catch (error) {
        const errorMessage =
          error instanceof Error ? error.message : "Login failed"
        showError(errorMessage)
      }
    } catch (validationError) {
      if (validationError instanceof z.ZodError) {
        // Format Zod validation errors
        const formattedErrors: Record<string, string> = {}
        validationError.issues.forEach((issue) => {
          if (issue.path[0]) {
            formattedErrors[issue.path[0].toString()] = issue.message
          }
        })
        setErrors(formattedErrors)
      }
    }
  }

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev === 2 ? 0 : prev + 1))
  }

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev === 0 ? 2 : prev - 1))
  }

  // Auto-advance slides
  useEffect(() => {
    const interval = setInterval(() => {
      nextSlide()
    }, 5000)
    return () => clearInterval(interval)
  }, [])

  // Redirect if already authenticated
  useEffect(() => {
    if (isAuthenticated) {
      router.push("/dashboard")
    }
  }, [isAuthenticated, router])

  return (
    <div className="flex relative w-full min-h-screen">
      {/* Left Panel */}
      <div className="flex flex-col justify-between py-12.5 px-17.5 w-145 shrink-0 items-start">
        <Image
          src="/logo.svg"
          width={139}
          height={42}
          className="flex shrink-0 h-10.5"
          alt="logo"
        />

        <form onSubmit={handleSubmit} className="flex flex-col w-full my-7">
          <h1 className="font-bold text-2xl leading-10.5">
            Sign In <br />
            as Student
          </h1>

          <label className="flex flex-col gap-2 mt-7.5">
            <p className="font-semibold">Email Address</p>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              className={`appearance-none outline-hidden w-full bg-white rounded-full h-12 font-semibold placeholder:font-normal placeholder:text-[#5e677e] py-3 px-6 border ${
                errors.email ? "border-red-500" : "border-[#BCC2CA]"
              } focus:border-[#493ef2] focus:ring-2 focus:ring-[#493ef2] focus:ring-opacity-50`}
              placeholder="Write your email"
              required
            />
            {errors.email && (
              <p className="text-red-500 text-sm mt-1">{errors.email}</p>
            )}
          </label>

          <label className="flex flex-col gap-2 mt-6">
            <p className="font-semibold">Password</p>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                value={formData.password}
                onChange={handleInputChange}
                className={`password-input appearance-none outline-hidden w-full bg-white rounded-full h-12 font-semibold placeholder:font-normal placeholder:text-[#5e677e] py-3 px-6 pr-12.5 border ${
                  errors.password ? "border-red-500" : "border-[#BCC2CA]"
                } focus:border-[#493ef2] focus:ring-2 focus:ring-[#493ef2] focus:ring-opacity-50`}
                placeholder="Input your password"
                required
              />
              <button
                type="button"
                onClick={togglePasswordVisibility}
                aria-label={showPassword ? "Hide password" : "Show password"}
                className="absolute transform -translate-x-1/2 -translate-y-1/2 top-1/2 right-3.5"
              >
                {showPassword ? (
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5 text-gray-500"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path d="M10 12a2 2 0 100-4 2 2 0 000 4z" />
                    <path
                      fillRule="evenodd"
                      d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z"
                      clipRule="evenodd"
                    />
                  </svg>
                ) : (
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5 text-gray-500"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fillRule="evenodd"
                      d="M3.707 2.293a1 1 0 00-1.414 1.414l14 14a1 1 0 001.414-1.414l-1.473-1.473A10.014 10.014 0 0019.542 10C18.268 5.943 14.478 3 10 3a9.958 9.958 0 00-4.512 1.074l-1.78-1.781zm4.261 4.26l1.514 1.515a2.003 2.003 0 012.45 2.45l1.514 1.514a4 4 0 00-5.478-5.478z"
                      clipRule="evenodd"
                    />
                    <path d="M12.454 16.697L9.75 13.992a4 4 0 01-3.742-3.741L2.335 6.578A9.98 9.98 0 00.458 10c1.274 4.057 5.065 7 9.542 7 .847 0 1.669-.105 2.454-.303z" />
                  </svg>
                )}
              </button>
            </div>
            {errors.password && (
              <p className="text-red-500 text-sm mt-1">{errors.password}</p>
            )}
            <a
              href="#"
              className="text-sm leading-5.25 text-[#5e677e] text-right hover:underline"
            >
              Forgot my password
            </a>
          </label>

          <div className="flex flex-col gap-4 mt-7.5">
            <button
              type="submit"
              disabled={isLoading}
              className="w-full h-12 rounded-full py-3 px-6 gap-2.5 bg-[#493ef2] text-center hover:bg-[#3a32d9] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <span className="font-bold text-white">
                {isLoading ? "Signing In..." : "Sign In"}
              </span>
            </button>
            <p className="rounded-2xl p-4 gap-2.5 bg-[#eceef1] leading-6.5">
              If you have a trouble while accessing the account, kindly contact
              your admin company account.
            </p>
          </div>
        </form>

        <ul className="flex gap-7.5">
          <li>
            <a
              href="#"
              className="text-sm leading-5.25 text-[#5e677e] hover:underline"
            >
              About
            </a>
          </li>
          <li>
            <a
              href="#"
              className="text-sm leading-5.25 text-[#5e677e] hover:underline"
            >
              Terms & Conditions
            </a>
          </li>
          <li>
            <a
              href="#"
              className="text-sm leading-5.25 text-[#5e677e] hover:underline"
            >
              Privacy Policy
            </a>
          </li>
        </ul>
      </div>

      {/* Right Panel with Slider */}
      <div className="flex h-screen w-full relative">
        {/* Slider Navigation */}
        <div className="fixed bottom-14.75 right-12.5 z-10 flex gap-4 w-fit">
          <button
            onClick={prevSlide}
            aria-label="Previous slide"
            className="p-2 rounded-full bg-white shadow-md hover:bg-gray-100 transition-colors"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5 text-gray-700"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fillRule="evenodd"
                d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z"
                clipRule="evenodd"
              />
            </svg>
          </button>
          <button
            onClick={nextSlide}
            aria-label="Next slide"
            className="p-2 rounded-full bg-white shadow-md hover:bg-gray-100 transition-colors"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5 text-gray-700"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fillRule="evenodd"
                d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
                clipRule="evenodd"
              />
            </svg>
          </button>
        </div>

        {/* Slide Indicators */}
        <div className="fixed bottom-7.5 left-1/2 transform -translate-x-1/2 z-10 flex gap-2">
          {[0, 1, 2].map((index) => (
            <button
              key={index}
              onClick={() => setCurrentSlide(index)}
              aria-label={`Go to slide ${index + 1}`}
              className={`w-3 h-3 rounded-full ${currentSlide === index ? "bg-white" : "bg-white bg-opacity-50"}`}
            />
          ))}
        </div>

        {/* Slider Content */}
        <div className="fixed top-0 flex w-[calc(100%-580px)] h-screen overflow-hidden">
          {/* Slide 1 */}
          <div
            className={`slide relative flex w-full h-full overflow-hidden ${currentSlide === 0 ? "block" : "hidden"}`}
          >
            <Image
              src="/login-slide-1.webp"
              fill
              className="object-cover object-top"
              alt="thumbnail"
            />
            <div className="absolute bottom-0 flex flex-col w-full h-fit pl-12.5 pr-11.25 pt-18.75 pb-12.5 gap-7.5 text-white bg-[linear-gradient(180deg,rgba(14,22,38,0)_0%,#0E1626_93.64%)]">
              <p className="font-medium text-[26px] leading-10">
                Sebagai recruiter jadi lebih praktis ketika menganalisa
                perfomance learning dari setiap karyawan pada perusahaan kami.
              </p>
              <div className="w-fit">
                <p className="font-semibold text-xl leading-7.5">Elina Mae</p>
                <p className="mt-1">Recruiter at Facebook</p>
              </div>
            </div>
          </div>

          {/* Slide 2 */}
          <div
            className={`slide relative flex w-full h-full overflow-hidden ${currentSlide === 1 ? "block" : "hidden"}`}
          >
            <Image
              src="/login-slide-2.webp"
              fill
              className="object-cover object-top"
              alt="thumbnail"
            />
            <div className="absolute bottom-0 flex flex-col w-full h-fit pl-12.5 pr-11.25 pt-18.75 pb-12.5 gap-7.5 text-white bg-[linear-gradient(180deg,rgba(14,22,38,0)_0%,#0E1626_93.64%)]">
              <p className="font-medium text-[26px] leading-10">
                WFH semakin asik karena bisa catch up skills terbaru pada LMS
                AnggaCircle buatan oleh perusahaan tempat saya bekerja.
              </p>
              <div className="w-fit">
                <p className="font-semibold text-xl leading-7.5">Yein Widada</p>
                <p className="mt-1">Engineer at BuildWithAngga</p>
              </div>
            </div>
          </div>

          {/* Slide 3 */}
          <div
            className={`slide relative flex w-full h-full overflow-hidden ${currentSlide === 2 ? "block" : "hidden"}`}
          >
            <Image
              src="/login-slide-3.webp"
              fill
              className="object-cover object-top"
              alt="thumbnail"
            />
            <div className="absolute bottom-0 flex flex-col w-full h-fit pl-12.5 pr-11.25 pt-18.75 pb-12.5 gap-7.5 text-white bg-[linear-gradient(180deg,rgba(14,22,38,0)_0%,#0E1626_93.64%)]">
              <p className="font-medium text-[26px] leading-10">
                LMS AnggaCircle telah membantu saya jadi lebih produktif dalam
                menguasai skills penting dibutuhkan oleh perusahaan saya.
              </p>
              <div className="w-fit">
                <p className="font-semibold text-xl leading-7.5">Shayna Max</p>
                <p className="mt-1">Employee at Google</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
