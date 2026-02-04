import ImageUpload from "@/components/ImageUpload"
import Link from "next/link"

export default function UploadPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white">
        <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
              Image Upload
            </h2>
            <p className="mt-2 text-lg leading-8 text-gray-600">
              Upload your images to our server.
            </p>
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="lg:grid lg:grid-cols-2 lg:gap-16">
          <div>
            <h2 className="text-lg font-semibold text-gray-900">
              Upload Guidelines
            </h2>
            <p className="mt-2 text-sm text-gray-600">
              Please follow these guidelines when uploading images:
            </p>
            <dl className="mt-8 space-y-6 text-sm text-gray-600">
              <div>
                <dt className="font-medium text-gray-900">Supported Formats</dt>
                <dd className="mt-1">JPEG, PNG, GIF, WebP</dd>
              </div>
              <div>
                <dt className="font-medium text-gray-900">Maximum File Size</dt>
                <dd className="mt-1">5MB per image</dd>
              </div>
              <div>
                <dt className="font-medium text-gray-900">Image Dimensions</dt>
                <dd className="mt-1">
                  Recommended: 1920x1080 pixels or higher
                </dd>
              </div>
              <div>
                <dt className="font-medium text-gray-900">Content Policy</dt>
                <dd className="mt-1">
                  Images must not contain offensive or copyrighted material
                </dd>
              </div>
            </dl>
          </div>

          <div className="mt-10 lg:mt-0">
            <ImageUpload
              onUploadSuccess={(response) => {
                console.log("Image uploaded successfully:", response)
              }}
              onUploadError={(error) => {
                console.error("Image upload error:", error)
              }}
              buttonText="Select Image"
            />
          </div>
        </div>
      </div>

      <div className="bg-white">
        <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
          <div className="border-t border-gray-200 pt-8">
            <div className="text-center">
              <p className="text-sm text-gray-500">
                Or go back to{" "}
                <Link
                  href="/"
                  className="font-medium text-indigo-600 hover:text-indigo-500"
                >
                  homepage
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
