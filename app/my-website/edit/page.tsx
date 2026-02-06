"use client"

import { useSession } from "next-auth/react"
import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"

interface WebsiteData {
  id: string
  businessName: string
  primaryColor: string
  secondaryColor: string
  accentColor: string
  deploymentUrl: string | null
  previewUrl: string | null
  formSubmissionId: string
}

interface EditableContent {
  headline: string
  subheadline: string
  ctaPrimary: string
  ctaSecondary: string
  aboutHeadline: string
  aboutText: string
  ctaHeadline: string
  ctaSubheadline: string
}

export default function EditWebsitePage() {
  const { status } = useSession()
  const router = useRouter()
  
  const [website, setWebsite] = useState<WebsiteData | null>(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)
  const [error, setError] = useState("")
  const [activeTab, setActiveTab] = useState<"colors" | "content">("colors")
  
  // Editable colors
  const [colors, setColors] = useState({
    primary: "#4F46E5",
    secondary: "#10B981",
    accent: "#F59E0B"
  })
  
  // Editable content
  const [content, setContent] = useState<EditableContent>({
    headline: "",
    subheadline: "",
    ctaPrimary: "Get Started",
    ctaSecondary: "Learn More",
    aboutHeadline: "",
    aboutText: "",
    ctaHeadline: "",
    ctaSubheadline: ""
  })

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
      
      if (data.website) {
        setWebsite(data.website)
        setColors({
          primary: data.website.primaryColor || "#4F46E5",
          secondary: data.website.secondaryColor || "#10B981",
          accent: data.website.accentColor || "#F59E0B"
        })
        
        // Load saved content if available
        if (data.website.customContent) {
          setContent(data.website.customContent)
        }
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load website")
    } finally {
      setLoading(false)
    }
  }

  const handleSave = async () => {
    if (!website) return
    
    setSaving(true)
    setSaved(false)
    setError("")
    
    try {
      const response = await fetch("/api/user/website/update", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          websiteId: website.id,
          colors,
          content
        })
      })
      
      if (!response.ok) {
        const data = await response.json()
        throw new Error(data.error || "Failed to save changes")
      }
      
      setSaved(true)
      setTimeout(() => setSaved(false), 3000)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to save")
    } finally {
      setSaving(false)
    }
  }

  if (status === "loading" || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-900">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-500 mx-auto"></div>
          <p className="mt-4 text-gray-400">Loading editor...</p>
        </div>
      </div>
    )
  }

  if (!website) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-900 px-4">
        <div className="max-w-md w-full bg-gray-800 rounded-xl p-8 text-center">
          <div className="text-gray-500 text-5xl mb-4">🚧</div>
          <h2 className="text-2xl font-bold text-white mb-2">No Website Found</h2>
          <p className="text-gray-400 mb-6">
            Your website needs to be generated first.
          </p>
          <button
            onClick={() => router.push("/my-website")}
            className="bg-indigo-600 text-white px-6 py-2 rounded-lg hover:bg-indigo-700 transition-colors"
          >
            Go Back
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-900 flex">
      {/* Left Panel - Editor Controls */}
      <div className="w-96 bg-gray-800 border-r border-gray-700 flex flex-col h-screen overflow-hidden">
        {/* Header */}
        <div className="p-4 border-b border-gray-700">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-lg font-bold text-white">Website Editor</h1>
              <p className="text-xs text-gray-400 mt-1">{website.businessName}</p>
            </div>
            <button
              onClick={() => router.push("/my-website")}
              className="text-gray-400 hover:text-white p-2"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex border-b border-gray-700">
          <button
            onClick={() => setActiveTab("colors")}
            className={`flex-1 py-3 px-4 text-sm font-medium transition-colors ${
              activeTab === "colors"
                ? "text-indigo-400 border-b-2 border-indigo-400 bg-gray-900/50"
                : "text-gray-400 hover:text-white"
            }`}
          >
            🎨 Colors
          </button>
          <button
            onClick={() => setActiveTab("content")}
            className={`flex-1 py-3 px-4 text-sm font-medium transition-colors ${
              activeTab === "content"
                ? "text-indigo-400 border-b-2 border-indigo-400 bg-gray-900/50"
                : "text-gray-400 hover:text-white"
            }`}
          >
            ✏️ Content
          </button>
        </div>

        {/* Editor Content - Scrollable */}
        <div className="flex-1 overflow-y-auto p-4 space-y-6">
          {activeTab === "colors" && (
            <>
              {/* Color Pickers */}
              <div>
                <h3 className="text-sm font-semibold text-white mb-4">Brand Colors</h3>
                <div className="space-y-4">
                  {/* Primary Color */}
                  <div className="bg-gray-900/50 rounded-lg p-4">
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Primary Color
                    </label>
                    <div className="flex items-center gap-3">
                      <input
                        type="color"
                        value={colors.primary}
                        onChange={(e) => setColors({ ...colors, primary: e.target.value })}
                        className="w-12 h-12 rounded-lg cursor-pointer border-0 bg-transparent"
                      />
                      <input
                        type="text"
                        value={colors.primary}
                        onChange={(e) => setColors({ ...colors, primary: e.target.value })}
                        className="flex-1 bg-gray-800 border border-gray-600 rounded-lg px-3 py-2 text-white text-sm font-mono"
                      />
                    </div>
                    <p className="text-xs text-gray-500 mt-2">Used for buttons, links, and highlights</p>
                  </div>

                  {/* Secondary Color */}
                  <div className="bg-gray-900/50 rounded-lg p-4">
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Secondary Color
                    </label>
                    <div className="flex items-center gap-3">
                      <input
                        type="color"
                        value={colors.secondary}
                        onChange={(e) => setColors({ ...colors, secondary: e.target.value })}
                        className="w-12 h-12 rounded-lg cursor-pointer border-0 bg-transparent"
                      />
                      <input
                        type="text"
                        value={colors.secondary}
                        onChange={(e) => setColors({ ...colors, secondary: e.target.value })}
                        className="flex-1 bg-gray-800 border border-gray-600 rounded-lg px-3 py-2 text-white text-sm font-mono"
                      />
                    </div>
                    <p className="text-xs text-gray-500 mt-2">Used for gradients and backgrounds</p>
                  </div>

                  {/* Accent Color */}
                  <div className="bg-gray-900/50 rounded-lg p-4">
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Accent Color
                    </label>
                    <div className="flex items-center gap-3">
                      <input
                        type="color"
                        value={colors.accent}
                        onChange={(e) => setColors({ ...colors, accent: e.target.value })}
                        className="w-12 h-12 rounded-lg cursor-pointer border-0 bg-transparent"
                      />
                      <input
                        type="text"
                        value={colors.accent}
                        onChange={(e) => setColors({ ...colors, accent: e.target.value })}
                        className="flex-1 bg-gray-800 border border-gray-600 rounded-lg px-3 py-2 text-white text-sm font-mono"
                      />
                    </div>
                    <p className="text-xs text-gray-500 mt-2">Used for decorative elements</p>
                  </div>
                </div>
              </div>

              {/* Color Presets */}
              <div>
                <h3 className="text-sm font-semibold text-white mb-3">Quick Presets</h3>
                <div className="grid grid-cols-3 gap-2">
                  {[
                    { name: "Modern Blue", primary: "#3B82F6", secondary: "#8B5CF6", accent: "#EC4899" },
                    { name: "Forest", primary: "#059669", secondary: "#0D9488", accent: "#F59E0B" },
                    { name: "Sunset", primary: "#F97316", secondary: "#EF4444", accent: "#FCD34D" },
                    { name: "Ocean", primary: "#0EA5E9", secondary: "#6366F1", accent: "#22D3EE" },
                    { name: "Elegant", primary: "#1F2937", secondary: "#4B5563", accent: "#D97706" },
                    { name: "Fresh", primary: "#10B981", secondary: "#3B82F6", accent: "#F43F5E" },
                  ].map((preset) => (
                    <button
                      key={preset.name}
                      onClick={() => setColors({ primary: preset.primary, secondary: preset.secondary, accent: preset.accent })}
                      className="p-2 rounded-lg bg-gray-900/50 hover:bg-gray-700 transition-colors text-left"
                    >
                      <div className="flex gap-1 mb-1">
                        <div className="w-4 h-4 rounded" style={{ backgroundColor: preset.primary }}></div>
                        <div className="w-4 h-4 rounded" style={{ backgroundColor: preset.secondary }}></div>
                        <div className="w-4 h-4 rounded" style={{ backgroundColor: preset.accent }}></div>
                      </div>
                      <span className="text-xs text-gray-400">{preset.name}</span>
                    </button>
                  ))}
                </div>
              </div>
            </>
          )}

          {activeTab === "content" && (
            <>
              {/* Hero Section */}
              <div>
                <h3 className="text-sm font-semibold text-white mb-4">Hero Section</h3>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Headline
                    </label>
                    <input
                      type="text"
                      value={content.headline}
                      onChange={(e) => setContent({ ...content, headline: e.target.value })}
                      placeholder="Your main headline..."
                      className="w-full bg-gray-900/50 border border-gray-600 rounded-lg px-3 py-2 text-white text-sm placeholder-gray-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Subheadline
                    </label>
                    <textarea
                      value={content.subheadline}
                      onChange={(e) => setContent({ ...content, subheadline: e.target.value })}
                      placeholder="A brief description of your business..."
                      rows={3}
                      className="w-full bg-gray-900/50 border border-gray-600 rounded-lg px-3 py-2 text-white text-sm placeholder-gray-500 resize-none"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">
                        Primary CTA
                      </label>
                      <input
                        type="text"
                        value={content.ctaPrimary}
                        onChange={(e) => setContent({ ...content, ctaPrimary: e.target.value })}
                        placeholder="Get Started"
                        className="w-full bg-gray-900/50 border border-gray-600 rounded-lg px-3 py-2 text-white text-sm placeholder-gray-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">
                        Secondary CTA
                      </label>
                      <input
                        type="text"
                        value={content.ctaSecondary}
                        onChange={(e) => setContent({ ...content, ctaSecondary: e.target.value })}
                        placeholder="Learn More"
                        className="w-full bg-gray-900/50 border border-gray-600 rounded-lg px-3 py-2 text-white text-sm placeholder-gray-500"
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* About Section */}
              <div>
                <h3 className="text-sm font-semibold text-white mb-4">About Section</h3>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      About Headline
                    </label>
                    <input
                      type="text"
                      value={content.aboutHeadline}
                      onChange={(e) => setContent({ ...content, aboutHeadline: e.target.value })}
                      placeholder="Why choose us?"
                      className="w-full bg-gray-900/50 border border-gray-600 rounded-lg px-3 py-2 text-white text-sm placeholder-gray-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      About Text
                    </label>
                    <textarea
                      value={content.aboutText}
                      onChange={(e) => setContent({ ...content, aboutText: e.target.value })}
                      placeholder="Tell your story..."
                      rows={4}
                      className="w-full bg-gray-900/50 border border-gray-600 rounded-lg px-3 py-2 text-white text-sm placeholder-gray-500 resize-none"
                    />
                  </div>
                </div>
              </div>

              {/* CTA Section */}
              <div>
                <h3 className="text-sm font-semibold text-white mb-4">Call to Action Section</h3>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      CTA Headline
                    </label>
                    <input
                      type="text"
                      value={content.ctaHeadline}
                      onChange={(e) => setContent({ ...content, ctaHeadline: e.target.value })}
                      placeholder="Ready to get started?"
                      className="w-full bg-gray-900/50 border border-gray-600 rounded-lg px-3 py-2 text-white text-sm placeholder-gray-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      CTA Subheadline
                    </label>
                    <input
                      type="text"
                      value={content.ctaSubheadline}
                      onChange={(e) => setContent({ ...content, ctaSubheadline: e.target.value })}
                      placeholder="Contact us today for a free consultation"
                      className="w-full bg-gray-900/50 border border-gray-600 rounded-lg px-3 py-2 text-white text-sm placeholder-gray-500"
                    />
                  </div>
                </div>
              </div>
            </>
          )}
        </div>

        {/* Save Button - Fixed at Bottom */}
        <div className="p-4 border-t border-gray-700 bg-gray-800">
          {error && (
            <div className="mb-3 p-3 bg-red-500/10 border border-red-500/30 rounded-lg text-red-400 text-sm">
              {error}
            </div>
          )}
          {saved && (
            <div className="mb-3 p-3 bg-green-500/10 border border-green-500/30 rounded-lg text-green-400 text-sm">
              ✓ Changes saved and deployed successfully!
            </div>
          )}
          <button
            onClick={handleSave}
            disabled={saving}
            className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 text-white py-3 rounded-lg font-semibold hover:from-indigo-700 hover:to-purple-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {saving ? (
              <>
                <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                </svg>
                <span>Saving & Deploying...</span>
              </>
            ) : (
              <>
                <span>💾</span>
                <span>Save & Deploy Changes</span>
              </>
            )}
          </button>
          <p className="text-xs text-gray-500 text-center mt-2">
            Changes will be live within seconds
          </p>
        </div>
      </div>

      {/* Right Panel - Live Preview */}
      <div className="flex-1 flex flex-col">
        {/* Preview Header */}
        <div className="bg-gray-800 border-b border-gray-700 p-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="flex gap-1.5">
              <div className="w-3 h-3 rounded-full bg-red-500"></div>
              <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
              <div className="w-3 h-3 rounded-full bg-green-500"></div>
            </div>
            <span className="text-sm text-gray-400">{website.deploymentUrl || "Preview"}</span>
          </div>
          {website.deploymentUrl && (
            <a
              href={website.deploymentUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm text-indigo-400 hover:text-indigo-300"
            >
              Open in new tab →
            </a>
          )}
        </div>

        {/* Preview iframe */}
        <div className="flex-1 bg-gray-900">
          <iframe
            src={website.deploymentUrl || `/api/preview/${website.formSubmissionId}`}
            className="w-full h-full border-0"
            title="Website Preview"
            key={`preview-${saved}`}
          />
        </div>
      </div>
    </div>
  )
}
