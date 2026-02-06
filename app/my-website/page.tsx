"use client"

import { useSession, signOut } from "next-auth/react"
import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"

interface GeneratedWebsite {
  id: string
  businessName: string
  templateId: string
  primaryColor: string
  secondaryColor: string
  accentColor: string
  previewUrl: string | null
  deploymentUrl: string | null
  status: string
  publishApproved: boolean
  deployedAt: Date | null
  createdAt: Date
}

export default function MyWebsitePage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [website, setWebsite] = useState<GeneratedWebsite | null>(null)
  const [loading, setLoading] = useState(true)
  const [publishing, setPublishing] = useState(false)
  const [error, setError] = useState("")
  const [successMessage, setSuccessMessage] = useState("")

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/login")
      return
    }

    if (status === "authenticated") {
      fetchWebsite()
    }
  }, [status])

  const fetchWebsite = async () => {
    try {
      const response = await fetch("/api/user/website")
      
      if (!response.ok) {
        throw new Error("Failed to fetch website")
      }

      const data = await response.json()
      setWebsite(data.website)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load website")
    } finally {
      setLoading(false)
    }
  }

  const handlePublish = async () => {
    if (!website) return
    
    setPublishing(true)
    setError("")
    setSuccessMessage("")
    
    try {
      const response = await fetch("/api/user/website/publish", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ websiteId: website.id })
      })
      
      const data = await response.json()
      
      if (!response.ok) {
        throw new Error(data.error || "Failed to publish website")
      }
      
      // Check if it was a pending approval response
      if (data.status === 'PENDING_APPROVAL' || data.requiresApproval) {
        setSuccessMessage("📞 " + data.message)
      } else if (data.status === 'PUBLISHED') {
        setSuccessMessage("🎉 Website published successfully! Your site is now live.")
      } else {
        setSuccessMessage(data.message || "Request processed successfully!")
      }
      
      // Refresh website data
      await fetchWebsite()
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to publish")
    } finally {
      setPublishing(false)
    }
  }

  if (status === "loading" || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading your website...</p>
        </div>
      </div>
    )
  }

  if (error && !website) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
        <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-8 text-center">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Error Loading Website</h2>
          <p className="text-gray-600 mb-6">{error}</p>
          <button
            onClick={() => fetchWebsite()}
            className="bg-indigo-600 text-white px-6 py-2 rounded-lg hover:bg-indigo-700 transition-colors"
          >
            Try Again
          </button>
        </div>
      </div>
    )
  }

  if (!website) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
        <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-8 text-center">
          <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
            </svg>
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">No Website Yet</h2>
          <p className="text-gray-600 mb-6">
            Your website is being generated. This usually takes a few minutes.
          </p>
          <button
            onClick={() => fetchWebsite()}
            className="bg-indigo-600 text-white px-6 py-2 rounded-lg hover:bg-indigo-700 transition-colors"
          >
            Refresh
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">My Website</h1>
              <p className="text-sm text-gray-600 mt-1">
                Welcome, {session?.user?.name || session?.user?.email}
              </p>
            </div>
            <button
              onClick={() => signOut({ callbackUrl: "/" })}
              className="text-gray-600 hover:text-gray-900 px-4 py-2 rounded-lg border border-gray-300 hover:border-gray-400 transition-colors"
            >
              Sign Out
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Success Message */}
        {successMessage && (
          <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-xl text-green-800 flex items-center gap-3">
            <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
            <p>{successMessage}</p>
          </div>
        )}

        {/* Error Message */}
        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl text-red-800 flex items-center gap-3">
            <svg className="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
            <p>{error}</p>
          </div>
        )}

        {/* Website Info Card */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <div className="flex items-start justify-between mb-6">
            <div>
              <h2 className="text-xl font-bold text-gray-900 mb-2">{website.businessName}</h2>
              <div className="flex items-center gap-2">
                <span
                  className={`px-3 py-1 rounded-full text-xs font-medium ${
                    website.status === "PUBLISHED"
                      ? "bg-green-100 text-green-800"
                      : website.status === "PENDING_APPROVAL"
                      ? "bg-orange-100 text-orange-800"
                      : website.status === "READY"
                      ? "bg-blue-100 text-blue-800"
                      : "bg-yellow-100 text-yellow-800"
                  }`}
                >
                  {website.status === "READY" 
                    ? "Ready to Publish" 
                    : website.status === "PENDING_APPROVAL"
                    ? "Waiting for Approval"
                    : website.status}
                </span>
                {website.deployedAt && (
                  <span className="text-sm text-gray-500">
                    Published {new Date(website.deployedAt).toLocaleDateString()}
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* Color Palette */}
          <div className="mb-6">
            <h3 className="text-sm font-medium text-gray-700 mb-3">Brand Colors</h3>
            <div className="flex gap-3">
              <div className="flex flex-col items-center">
                <div
                  className="w-16 h-16 rounded-lg shadow-md border border-gray-200"
                  style={{ backgroundColor: website.primaryColor }}
                ></div>
                <span className="text-xs text-gray-600 mt-2">Primary</span>
              </div>
              <div className="flex flex-col items-center">
                <div
                  className="w-16 h-16 rounded-lg shadow-md border border-gray-200"
                  style={{ backgroundColor: website.secondaryColor }}
                ></div>
                <span className="text-xs text-gray-600 mt-2">Secondary</span>
              </div>
              <div className="flex flex-col items-center">
                <div
                  className="w-16 h-16 rounded-lg shadow-md border border-gray-200"
                  style={{ backgroundColor: website.accentColor }}
                ></div>
                <span className="text-xs text-gray-600 mt-2">Accent</span>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-wrap gap-3 mb-6">
            {/* Preview Button - Always visible */}
            {website.previewUrl && (
              <a
                href={website.previewUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex-1 sm:flex-none border border-indigo-300 text-indigo-700 bg-indigo-50 px-6 py-3 rounded-xl hover:bg-indigo-100 transition-all font-medium flex items-center justify-center gap-2"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                </svg>
                Preview Website
              </a>
            )}

            {/* Edit Button */}
            <button
              onClick={() => router.push("/my-website/edit")}
              className="flex-1 sm:flex-none border border-gray-300 text-gray-700 px-6 py-3 rounded-xl hover:border-gray-400 hover:bg-gray-50 transition-all font-medium flex items-center justify-center gap-2"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
              </svg>
              Edit Website
            </button>

            {/* Publish Button - Show different states */}
            {website.status === "PENDING_APPROVAL" && (
              <div className="flex-1 sm:flex-none bg-orange-100 border-2 border-orange-300 text-orange-800 px-6 py-3 rounded-xl font-medium flex items-center justify-center gap-2">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span>Awaiting Sales Approval</span>
              </div>
            )}

            {website.status !== "PUBLISHED" && website.status !== "PENDING_APPROVAL" && (
              <button
                onClick={handlePublish}
                disabled={publishing}
                className="flex-1 sm:flex-none bg-gradient-to-r from-green-600 to-emerald-600 text-white px-6 py-3 rounded-xl hover:from-green-700 hover:to-emerald-700 transition-all font-medium flex items-center justify-center gap-2 shadow-lg shadow-green-500/25 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {publishing ? (
                  <>
                    <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                    </svg>
                    <span>Processing...</span>
                  </>
                ) : (
                  <>
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                    </svg>
                    <span>{website.publishApproved ? "Publish to Live" : "Request to Publish"}</span>
                  </>
                )}
              </button>
            )}

            {/* View Live Site - Only if published */}
            {website.status === "PUBLISHED" && website.deploymentUrl && (
              <a
                href={website.deploymentUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex-1 sm:flex-none bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-6 py-3 rounded-xl hover:from-indigo-700 hover:to-purple-700 transition-all font-medium flex items-center justify-center gap-2 shadow-lg shadow-indigo-500/25"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                </svg>
                View Live Site
              </a>
            )}
          </div>

          {/* Status Info */}
          {website.status === "READY" && (
            <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg p-4 border border-blue-100 mb-4">
              <div className="flex items-start gap-3">
                <svg className="w-6 h-6 text-blue-600 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                </svg>
                <div>
                  <p className="font-medium text-blue-900">Your website is ready for preview!</p>
                  <p className="text-sm text-blue-700 mt-1">
                    Preview your website and make any edits. When you&apos;re happy with it, click &quot;Publish to Live&quot; to make it available to the world. Our sales team will be notified once you publish.
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Live URL - Only if published */}
          {website.status === "PUBLISHED" && website.deploymentUrl && (
            <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-lg p-4 border border-green-100">
              <div className="flex items-center justify-between flex-wrap gap-4">
                <div>
                  <p className="text-sm font-medium text-gray-700 mb-1">Live Website URL</p>
                  <a
                    href={website.deploymentUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-green-600 hover:text-green-700 font-medium break-all"
                  >
                    {website.deploymentUrl}
                  </a>
                </div>
                <span className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm font-medium flex items-center gap-1">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  Live
                </span>
              </div>
            </div>
          )}
        </div>

        {/* Website Preview */}
        {website.previewUrl && (
          <div className="bg-white rounded-lg shadow-md p-6">
            <h3 className="text-lg font-bold text-gray-900 mb-4">Website Preview</h3>
            <div className="border border-gray-200 rounded-lg overflow-hidden" style={{ height: "600px" }}>
              <iframe
                src={website.previewUrl}
                className="w-full h-full"
                title="Website Preview"
                sandbox="allow-scripts allow-same-origin"
              />
            </div>
          </div>
        )}
      </main>
    </div>
  )
}
