"use client"

import { useState, useRef } from "react"
import Image from "next/image"
import { api } from "@/lib/api"
import { z } from "zod"

// Image upload validation schema
export const imageUploadSchema = z.object({
  file: z
    .instanceof(File)
    .refine((file) => file.size > 0, { message: "File is required" })
    .refine(
      (file) => file.size <= 5 * 1024 * 1024, // 5MB
      { message: "File size must be less than 5MB" },
    )
    .refine(
      (file) =>
        ["image/jpeg", "image/png", "image/gif", "image/webp"].includes(
          file.type,
        ),
      { message: "File must be an image (JPEG, PNG, GIF, or WebP)" },
    ),
})

export interface ImageUploadResponse {
  success: boolean
  message: string
  data?: {
    url: string
    filename: string
    size: number
    mimetype: string
  }
}

interface ImageUploadProps {
  onUploadSuccess?: (response: ImageUploadResponse) => void
  onUploadError?: (error: Error) => void
  endpoint?: string
  maxFileSize?: number // in bytes
  acceptedFormats?: string[]
  className?: string
  buttonText?: string
  initialImage?: string
}

export default function ImageUpload({
  onUploadSuccess,
  onUploadError,
  endpoint = "/upload",
  maxFileSize = 5 * 1024 * 1024, // 5MB default
  acceptedFormats = ["image/jpeg", "image/png", "image/gif", "image/webp"],
  className = "",
  buttonText = "Upload Image",
  initialImage,
}: ImageUploadProps) {
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [previewUrl, setPreviewUrl] = useState<string | null>(
    initialImage || null,
  )
  const [isUploading, setIsUploading] = useState(false)
  const [uploadStatus, setUploadStatus] = useState<{
    type: "success" | "error" | null
    message: string
  }>({ type: null, message: "" })
  const [dragActive, setDragActive] = useState(false)

  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleFileChange = (file: File) => {
    try {
      // Create a dynamic schema based on the component props
      const dynamicSchema = z.object({
        file: z
          .instanceof(File)
          .refine((f) => f.size > 0, { message: "File is required" })
          .refine((f) => f.size <= maxFileSize, {
            message: `File size must be less than ${maxFileSize / (1024 * 1024)}MB`,
          })
          .refine((f) => acceptedFormats.includes(f.type), {
            message: `File must be one of: ${acceptedFormats.join(", ")}`,
          }),
      })

      // Validate the file
      dynamicSchema.parse({ file })

      // If validation passes, set the file and clear any errors
      setSelectedFile(file)
      setUploadStatus({ type: null, message: "" })

      // Create preview
      const reader = new FileReader()
      reader.onloadend = () => {
        setPreviewUrl(reader.result as string)
      }
      reader.readAsDataURL(file)
    } catch (error) {
      if (error instanceof z.ZodError) {
        const errorMessage = error.issues[0]?.message || "Invalid file"
        setUploadStatus({
          type: "error",
          message: errorMessage,
        })
      }
    }
  }

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      handleFileChange(e.target.files[0])
    }
  }

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true)
    } else if (e.type === "dragleave") {
      setDragActive(false)
    }
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setDragActive(false)

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileChange(e.dataTransfer.files[0])
    }
  }

  const handleUpload = async () => {
    if (!selectedFile) {
      setUploadStatus({
        type: "error",
        message: "Please select a file to upload",
      })
      return
    }

    setIsUploading(true)
    setUploadStatus({ type: null, message: "" })

    try {
      const formData = new FormData()
      formData.append("image", selectedFile)

      const response = await api.upload<ImageUploadResponse>(endpoint, formData)

      setUploadStatus({
        type: "success",
        message: response.data.message || "Image uploaded successfully!",
      })

      if (onUploadSuccess) {
        onUploadSuccess(response.data)
      }
    } catch (error) {
      const errorMessage =
        error instanceof Error
          ? error.message
          : "An error occurred during upload"

      setUploadStatus({
        type: "error",
        message: errorMessage,
      })

      if (onUploadError) {
        onUploadError(error instanceof Error ? error : new Error(errorMessage))
      }
    } finally {
      setIsUploading(false)
    }
  }

  const handleRemoveImage = () => {
    setSelectedFile(null)
    setPreviewUrl(null)
    setUploadStatus({ type: null, message: "" })
    if (fileInputRef.current) {
      fileInputRef.current.value = ""
    }
  }

  const triggerFileInput = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click()
    }
  }

  return (
    <div className={`space-y-4 ${className}`}>
      <div
        className={`relative rounded-lg border-2 border-dashed ${
          dragActive
            ? "border-indigo-500 bg-indigo-50"
            : "border-gray-300 bg-gray-50"
        } p-6 text-center`}
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
      >
        <input
          type="file"
          ref={fileInputRef}
          onChange={handleFileInput}
          className="hidden"
          accept={acceptedFormats.join(",")}
          aria-label="Image upload"
          title="Upload an image"
        />

        {previewUrl ? (
          <div className="space-y-4">
            <div className="relative mx-auto h-64 w-64 overflow-hidden rounded-lg">
              <Image
                src={previewUrl}
                alt="Preview"
                fill
                className="object-cover"
              />
            </div>
            <div className="flex justify-center space-x-2">
              <button
                type="button"
                onClick={triggerFileInput}
                className="rounded-md bg-white px-3 py-2 text-sm font-medium text-gray-700 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50"
              >
                Change Image
              </button>
              <button
                type="button"
                onClick={handleRemoveImage}
                className="rounded-md bg-white px-3 py-2 text-sm font-medium text-red-600 shadow-sm ring-1 ring-inset ring-red-300 hover:bg-red-50"
              >
                Remove
              </button>
            </div>
          </div>
        ) : (
          <div className="space-y-2">
            <svg
              className="mx-auto h-12 w-12 text-gray-400"
              stroke="currentColor"
              fill="none"
              viewBox="0 0 48 48"
              aria-hidden="true"
            >
              <path
                d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02"
                strokeWidth={2}
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
            <div className="flex text-sm text-gray-600">
              <label
                htmlFor="file-upload"
                className="relative cursor-pointer rounded-md bg-white font-medium text-indigo-600 focus-within:outline-none focus-within:ring-2 focus-within:ring-indigo-500 focus-within:ring-offset-2 hover:text-indigo-500"
              >
                <span>Upload a file</span>
              </label>
              <p className="pl-1">or drag and drop</p>
            </div>
            <p className="text-xs text-gray-500">
              PNG, JPG, GIF up to {maxFileSize / (1024 * 1024)}MB
            </p>
            <button
              type="button"
              onClick={triggerFileInput}
              className="mt-2 inline-flex items-center rounded-md border border-transparent bg-indigo-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
            >
              {buttonText}
            </button>
          </div>
        )}
      </div>

      {selectedFile && (
        <div className="text-sm text-gray-500">
          <p>Selected file: {selectedFile.name}</p>
          <p>Size: {(selectedFile.size / 1024).toFixed(2)} KB</p>
        </div>
      )}

      {uploadStatus.type && (
        <div
          className={`rounded-md p-4 ${
            uploadStatus.type === "success"
              ? "bg-green-50 text-green-800"
              : "bg-red-50 text-red-800"
          }`}
        >
          <p className="text-sm">{uploadStatus.message}</p>
        </div>
      )}

      {selectedFile && (
        <button
          type="button"
          onClick={handleUpload}
          disabled={isUploading}
          className="inline-flex justify-center rounded-md border border-transparent bg-indigo-600 py-2 px-4 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isUploading ? "Uploading..." : "Upload Image"}
        </button>
      )}
    </div>
  )
}
