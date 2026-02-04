import ContactForm from "@/components/ContactForm"
import Link from "next/link"

export default function ContactPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white">
        <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
              Contact Us
            </h2>
            <p className="mt-2 text-lg leading-8 text-gray-600">
              Have questions? We'd love to hear from you.
            </p>
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="lg:grid lg:grid-cols-2 lg:gap-16">
          <div>
            <h2 className="text-lg font-semibold text-gray-900">
              Get in touch
            </h2>
            <p className="mt-2 text-sm text-gray-600">
              Fill out the form and we'll get back to you as soon as possible.
            </p>
            <dl className="mt-8 space-y-6 text-sm text-gray-600">
              <div>
                <dt className="font-medium text-gray-900">Email address</dt>
                <dd className="mt-1">support@example.com</dd>
              </div>
              <div>
                <dt className="font-medium text-gray-900">Phone number</dt>
                <dd className="mt-1">+1 (555) 123-4567</dd>
              </div>
              <div>
                <dt className="font-medium text-gray-900">Office location</dt>
                <dd className="mt-1">
                  123 Main Street, Suite 100
                  <br />
                  Anytown, USA 12345
                </dd>
              </div>
            </dl>
          </div>

          <div className="mt-10 lg:mt-0">
            <ContactForm
              onSubmitSuccess={(response) => {
                console.log("Contact form submitted successfully:", response)
              }}
              onSubmitError={(error) => {
                console.error("Contact form submission error:", error)
              }}
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
