"use client"

import { useSession, signOut } from "next-auth/react"
import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import {
  AlertTriangle,
  Construction,
  CheckCircle2,
  Clock,
  Eye,
  Globe,
  Pencil,
  CloudUpload,
  ExternalLink,
  LogOut,
  RefreshCw,
  Loader2,
  Link2,
  Copy,
  X,
} from "lucide-react"

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
  const [showDomainModal, setShowDomainModal] = useState(false)
  const [customDomain, setCustomDomain] = useState("")

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
          <div className="text-red-600 text-5xl mb-4">⚠️</div>
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
          <div className="text-gray-400 text-5xl mb-4">🚧</div>
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
            <span className="text-2xl">✅</span>
            <p>{successMessage}</p>
          </div>
        )}

        {/* Error Message */}
        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl text-red-800 flex items-center gap-3">
            <span className="text-2xl">⚠️</span>
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
                    ? "⏳ Waiting for Approval"
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
                <Eye className="w-5 h-5" />
                Preview Website
              </a>
            )}

            {/* Edit Button */}
            <button
              onClick={() => router.push("/my-website/edit")}
              className="flex-1 sm:flex-none border border-gray-300 text-gray-700 px-6 py-3 rounded-xl hover:border-gray-400 hover:bg-gray-50 transition-all font-medium flex items-center justify-center gap-2"
            >
              <Pencil className="w-5 h-5" />
              Edit Website
            </button>

            {/* Publish Button - Show different states */}
            {website.status === "PENDING_APPROVAL" && (
              <div className="flex-1 sm:flex-none bg-orange-100 border-2 border-orange-300 text-orange-800 px-6 py-3 rounded-xl font-medium flex items-center justify-center gap-2">
                <Clock className="w-5 h-5" />
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
                    <Loader2 className="w-5 h-5 animate-spin" />
                    <span>Processing...</span>
                  </>
                ) : (
                  <>
                    <CloudUpload className="w-5 h-5" />
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
                <ExternalLink className="w-5 h-5" />
                View Live Site
              </a>
            )}

            {/* Custom Domain - Only if published */}
            {website.status === "PUBLISHED" && website.deploymentUrl && (
              <button
                onClick={() => setShowDomainModal(true)}
                className="flex-1 sm:flex-none border border-purple-300 text-purple-700 bg-purple-50 px-6 py-3 rounded-xl hover:bg-purple-100 transition-all font-medium flex items-center justify-center gap-2"
              >
                <Link2 className="w-5 h-5" />
                Custom Domain
              </button>
            )}
          </div>

          {/* Status Info */}
          {website.status === "READY" && (
            <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg p-4 border border-blue-100 mb-4">
              <div className="flex items-start gap-3">
                <span className="text-2xl">👁️</span>
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
                  <p className="text-sm font-medium text-gray-700 mb-1">🌐 Live Website URL</p>
                  <a
                    href={website.deploymentUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-green-600 hover:text-green-700 font-medium break-all"
                  >
                    {website.deploymentUrl}
                  </a>
                </div>
                <span className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm font-medium">
                  ✓ Live
                </span>
              </div>
            </div>
          )}
        </div>

        {/* Website Preview */}
        {website.previewUrl && (
          <div className="bg-white rounded-lg shadow-md p-6 hidden md:block">
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

        {/* Mobile: show preview link instead of iframe */}
        {website.previewUrl && (
          <div className="md:hidden bg-white rounded-lg shadow-md p-6">
            <h3 className="text-lg font-bold text-gray-900 mb-3">Website Preview</h3>
            <a
              href={website.previewUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-2 w-full py-3 border border-indigo-300 text-indigo-700 bg-indigo-50 rounded-xl hover:bg-indigo-100 transition-all font-medium"
            >
              <ExternalLink className="w-4 h-4" />
              Open Preview in New Tab
            </a>
          </div>
        )}
      </main>

      {/* Custom Domain Modal */}
      {showDomainModal && website?.deploymentUrl && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-lg w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-100 flex items-center justify-between">
              <div>
                <h3 className="text-lg font-bold text-gray-900">Connect Custom Domain</h3>
                <p className="text-sm text-gray-500 mt-1">Point your own domain to your website</p>
              </div>
              <button
                onClick={() => setShowDomainModal(false)}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <X className="w-5 h-5 text-gray-400" />
              </button>
            </div>

            <div className="p-6 space-y-6">
              {/* Current Netlify URL */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Your Current Site URL</label>
                <div className="flex items-center gap-2">
                  <code className="flex-1 bg-gray-50 border border-gray-200 rounded-lg px-3 py-2.5 text-sm text-gray-700 font-mono truncate">
                    {website.deploymentUrl}
                  </code>
                  <button
                    onClick={() => {
                      navigator.clipboard.writeText(website.deploymentUrl || "")
                    }}
                    className="p-2.5 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
                    title="Copy URL"
                  >
                    <Copy className="w-4 h-4 text-gray-500" />
                  </button>
                </div>
              </div>

              {/* Steps */}
              <div>
                <h4 className="text-sm font-semibold text-gray-900 mb-3">Setup Instructions</h4>
                <div className="space-y-4">
                  <div className="flex gap-3">
                    <span className="flex-shrink-0 w-6 h-6 bg-indigo-100 text-indigo-700 rounded-full flex items-center justify-center text-xs font-bold">1</span>
                    <div>
                      <p className="text-sm font-medium text-gray-900">Go to your domain registrar</p>
                      <p className="text-xs text-gray-500 mt-0.5">GoDaddy, Namecheap, Cloudflare, Google Domains, etc.</p>
                    </div>
                  </div>

                  <div className="flex gap-3">
                    <span className="flex-shrink-0 w-6 h-6 bg-indigo-100 text-indigo-700 rounded-full flex items-center justify-center text-xs font-bold">2</span>
                    <div>
                      <p className="text-sm font-medium text-gray-900">Add a CNAME record</p>
                      <p className="text-xs text-gray-500 mt-0.5">Point your domain to your Netlify site</p>
                      <div className="mt-2 bg-gray-50 border border-gray-200 rounded-lg p-3 space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="text-xs text-gray-500">Type</span>
                          <code className="text-xs font-mono font-semibold text-gray-800">CNAME</code>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-xs text-gray-500">Name / Host</span>
                          <code className="text-xs font-mono font-semibold text-gray-800">www</code>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-xs text-gray-500">Value / Points to</span>
                          <div className="flex items-center gap-1.5">
                            <code className="text-xs font-mono font-semibold text-gray-800">
                              {website.deploymentUrl?.replace('https://', '').replace('http://', '').replace(/\/$/, '')}
                            </code>
                            <button
                              onClick={() => {
                                const target = website.deploymentUrl?.replace('https://', '').replace('http://', '').replace(/\/$/, '') || ""
                                navigator.clipboard.writeText(target)
                              }}
                              className="p-1 hover:bg-gray-200 rounded"
                              title="Copy"
                            >
                              <Copy className="w-3 h-3 text-gray-400" />
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="flex gap-3">
                    <span className="flex-shrink-0 w-6 h-6 bg-indigo-100 text-indigo-700 rounded-full flex items-center justify-center text-xs font-bold">3</span>
                    <div>
                      <p className="text-sm font-medium text-gray-900">For root domain (no www)</p>
                      <p className="text-xs text-gray-500 mt-0.5">Add an A record pointing to Netlify&apos;s load balancer</p>
                      <div className="mt-2 bg-gray-50 border border-gray-200 rounded-lg p-3 space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="text-xs text-gray-500">Type</span>
                          <code className="text-xs font-mono font-semibold text-gray-800">A</code>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-xs text-gray-500">Name / Host</span>
                          <code className="text-xs font-mono font-semibold text-gray-800">@</code>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-xs text-gray-500">Value / Points to</span>
                          <div className="flex items-center gap-1.5">
                            <code className="text-xs font-mono font-semibold text-gray-800">75.2.60.5</code>
                            <button
                              onClick={() => navigator.clipboard.writeText("75.2.60.5")}
                              className="p-1 hover:bg-gray-200 rounded"
                              title="Copy"
                            >
                              <Copy className="w-3 h-3 text-gray-400" />
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="flex gap-3">
                    <span className="flex-shrink-0 w-6 h-6 bg-indigo-100 text-indigo-700 rounded-full flex items-center justify-center text-xs font-bold">4</span>
                    <div>
                      <p className="text-sm font-medium text-gray-900">Enter your domain below</p>
                      <p className="text-xs text-gray-500 mt-0.5">We&apos;ll configure it on our end and set up free SSL</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Domain Input */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Your Custom Domain</label>
                <input
                  type="text"
                  value={customDomain}
                  onChange={(e) => setCustomDomain(e.target.value)}
                  placeholder="e.g., www.yourbusiness.com"
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all bg-white text-gray-900 placeholder-gray-400"
                />
                <p className="text-xs text-gray-400 mt-1.5">
                  DNS changes can take up to 48 hours to propagate
                </p>
              </div>

              {/* Action buttons */}
              <div className="flex gap-3">
                <button
                  onClick={() => setShowDomainModal(false)}
                  className="flex-1 px-4 py-2.5 border border-gray-200 text-gray-700 rounded-xl hover:bg-gray-50 transition-colors font-medium text-sm"
                >
                  Cancel
                </button>
                <button
                  onClick={() => {
                    if (!customDomain.trim()) return
                    // For now, open the Netlify domain settings page
                    const siteName = website.deploymentUrl?.replace('https://', '').replace('.netlify.app', '').replace(/\/$/, '')
                    window.open(`https://app.netlify.com/sites/${siteName}/domain-management`, '_blank')
                    setShowDomainModal(false)
                  }}
                  disabled={!customDomain.trim()}
                  className="flex-1 px-4 py-2.5 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 transition-colors font-medium text-sm disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  <Link2 className="w-4 h-4" />
                  Connect Domain
                </button>
              </div>

              {/* Help note */}
              <div className="bg-indigo-50 border border-indigo-100 rounded-xl p-4">
                <p className="text-xs text-indigo-700">
                  <strong>Need help?</strong> Contact our sales team and we&apos;ll set up your custom domain for you at no extra charge.
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
