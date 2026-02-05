"use client"

import { useState, useEffect } from "react"

interface Website {
  id: string
  businessName: string
  customerEmail: string
  customerPhone?: string
  username?: string
  previewUrl?: string
  publishRequestedAt?: string
  approvedAt?: string
  approvedBy?: string
  deploymentUrl?: string
  deployedAt?: string
  createdAt?: string
}

interface WebsitesData {
  pendingApproval: Website[]
  approved: Website[]
  published: Website[]
  ready: Website[]
}

interface Summary {
  total: number
  pendingApproval: number
  approved: number
  published: number
  ready: number
}

export default function SalesDashboard() {
  const [secret, setSecret] = useState("")
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [loading, setLoading] = useState(false)
  const [websites, setWebsites] = useState<WebsitesData | null>(null)
  const [summary, setSummary] = useState<Summary | null>(null)
  const [error, setError] = useState("")
  const [successMessage, setSuccessMessage] = useState("")
  const [approvingId, setApprovingId] = useState<string | null>(null)

  const fetchWebsites = async () => {
    setLoading(true)
    setError("")
    
    try {
      const response = await fetch(`/api/admin/websites?secret=${secret}`)
      const data = await response.json()
      
      if (!response.ok) {
        throw new Error(data.error || "Failed to fetch websites")
      }
      
      setWebsites(data.websites)
      setSummary(data.summary)
      setIsAuthenticated(true)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load data")
      setIsAuthenticated(false)
    } finally {
      setLoading(false)
    }
  }

  const handleApprove = async (websiteId: string, businessName: string) => {
    setApprovingId(websiteId)
    setError("")
    setSuccessMessage("")
    
    try {
      const response = await fetch("/api/admin/approve", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          websiteId,
          adminSecret: secret,
          salesPersonName: "Sales Team"
        })
      })
      
      const data = await response.json()
      
      if (!response.ok) {
        throw new Error(data.error || "Failed to approve website")
      }
      
      setSuccessMessage(`✅ ${businessName} has been approved! Customer can now publish.`)
      
      // Refresh the list
      await fetchWebsites()
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to approve")
    } finally {
      setApprovingId(null)
    }
  }

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault()
    fetchWebsites()
  }

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
        <div className="bg-white rounded-xl shadow-lg p-8 max-w-md w-full">
          <h1 className="text-2xl font-bold text-gray-900 mb-6 text-center">
            🔐 Sales Dashboard
          </h1>
          
          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Admin Secret
              </label>
              <input
                type="password"
                value={secret}
                onChange={(e) => setSecret(e.target.value)}
                placeholder="Enter admin secret..."
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                required
              />
            </div>
            
            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
                {error}
              </div>
            )}
            
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-indigo-600 text-white py-3 px-4 rounded-lg font-semibold hover:bg-indigo-700 disabled:opacity-50 transition-colors"
            >
              {loading ? "Loading..." : "Access Dashboard"}
            </button>
          </form>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">📊 Sales Dashboard</h1>
            <p className="text-gray-600 mt-1">Manage website publish approvals</p>
          </div>
          <button
            onClick={fetchWebsites}
            disabled={loading}
            className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 disabled:opacity-50"
          >
            {loading ? "Refreshing..." : "🔄 Refresh"}
          </button>
        </div>

        {/* Summary Cards */}
        {summary && (
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-8">
            <div className="bg-white rounded-xl p-4 shadow">
              <p className="text-3xl font-bold text-gray-900">{summary.total}</p>
              <p className="text-sm text-gray-600">Total Websites</p>
            </div>
            <div className="bg-orange-50 border-2 border-orange-200 rounded-xl p-4">
              <p className="text-3xl font-bold text-orange-600">{summary.pendingApproval}</p>
              <p className="text-sm text-orange-700">⏳ Pending Approval</p>
            </div>
            <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
              <p className="text-3xl font-bold text-blue-600">{summary.approved}</p>
              <p className="text-sm text-blue-700">✅ Approved</p>
            </div>
            <div className="bg-green-50 border border-green-200 rounded-xl p-4">
              <p className="text-3xl font-bold text-green-600">{summary.published}</p>
              <p className="text-sm text-green-700">🚀 Published</p>
            </div>
            <div className="bg-gray-50 border border-gray-200 rounded-xl p-4">
              <p className="text-3xl font-bold text-gray-600">{summary.ready}</p>
              <p className="text-sm text-gray-600">📋 Ready</p>
            </div>
          </div>
        )}

        {/* Messages */}
        {successMessage && (
          <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg mb-6">
            {successMessage}
          </div>
        )}
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6">
            {error}
          </div>
        )}

        {/* Pending Approval Section - Most Important */}
        <div className="bg-white rounded-xl shadow-lg mb-8">
          <div className="bg-orange-500 text-white px-6 py-4 rounded-t-xl">
            <h2 className="text-xl font-bold flex items-center gap-2">
              🔔 Pending Approval ({websites?.pendingApproval.length || 0})
            </h2>
            <p className="text-orange-100 text-sm">These customers have clicked "Publish" and are waiting for your call</p>
          </div>
          
          <div className="p-6">
            {websites?.pendingApproval.length === 0 ? (
              <p className="text-gray-500 text-center py-8">No pending approvals at the moment 🎉</p>
            ) : (
              <div className="space-y-4">
                {websites?.pendingApproval.map((website) => (
                  <div key={website.id} className="border-2 border-orange-200 rounded-lg p-4 bg-orange-50">
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                      <div className="flex-1">
                        <h3 className="text-lg font-bold text-gray-900">{website.businessName}</h3>
                        <div className="mt-2 space-y-1 text-sm">
                          <p><span className="text-gray-500">📧 Email:</span> <a href={`mailto:${website.customerEmail}`} className="text-indigo-600 hover:underline">{website.customerEmail}</a></p>
                          {website.customerPhone && (
                            <p><span className="text-gray-500">📞 Phone:</span> <a href={`tel:${website.customerPhone}`} className="text-indigo-600 hover:underline font-bold text-lg">{website.customerPhone}</a></p>
                          )}
                          <p><span className="text-gray-500">👤 Username:</span> <code className="bg-white px-2 py-1 rounded">{website.username}</code></p>
                          <p><span className="text-gray-500">⏰ Requested:</span> {website.publishRequestedAt ? new Date(website.publishRequestedAt).toLocaleString() : 'N/A'}</p>
                        </div>
                      </div>
                      
                      <div className="flex flex-col gap-2">
                        {website.previewUrl && (
                          <a
                            href={website.previewUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="bg-indigo-100 text-indigo-700 px-4 py-2 rounded-lg text-center hover:bg-indigo-200 transition-colors"
                          >
                            👁️ Preview
                          </a>
                        )}
                        <button
                          onClick={() => handleApprove(website.id, website.businessName)}
                          disabled={approvingId === website.id}
                          className="bg-green-600 text-white px-6 py-3 rounded-lg font-bold hover:bg-green-700 disabled:opacity-50 transition-colors"
                        >
                          {approvingId === website.id ? "Approving..." : "✅ Approve for Publish"}
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Approved Section */}
        <div className="bg-white rounded-xl shadow mb-8">
          <div className="bg-blue-500 text-white px-6 py-4 rounded-t-xl">
            <h2 className="text-xl font-bold">✅ Approved ({websites?.approved.length || 0})</h2>
            <p className="text-blue-100 text-sm">Waiting for customer to publish</p>
          </div>
          <div className="p-6">
            {websites?.approved.length === 0 ? (
              <p className="text-gray-500 text-center py-4">No approved websites waiting</p>
            ) : (
              <div className="grid gap-3">
                {websites?.approved.map((website) => (
                  <div key={website.id} className="border rounded-lg p-4 flex justify-between items-center">
                    <div>
                      <h3 className="font-semibold">{website.businessName}</h3>
                      <p className="text-sm text-gray-500">{website.customerEmail}</p>
                    </div>
                    <div className="text-right text-sm text-gray-500">
                      <p>Approved: {website.approvedAt ? new Date(website.approvedAt).toLocaleDateString() : 'N/A'}</p>
                      <p>By: {website.approvedBy}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Published Section */}
        <div className="bg-white rounded-xl shadow">
          <div className="bg-green-500 text-white px-6 py-4 rounded-t-xl">
            <h2 className="text-xl font-bold">🚀 Published ({websites?.published.length || 0})</h2>
            <p className="text-green-100 text-sm">Live websites</p>
          </div>
          <div className="p-6">
            {websites?.published.length === 0 ? (
              <p className="text-gray-500 text-center py-4">No published websites yet</p>
            ) : (
              <div className="grid gap-3">
                {websites?.published.map((website) => (
                  <div key={website.id} className="border border-green-200 rounded-lg p-4 bg-green-50 flex justify-between items-center">
                    <div>
                      <h3 className="font-semibold">{website.businessName}</h3>
                      <p className="text-sm text-gray-500">{website.customerEmail}</p>
                    </div>
                    <div className="text-right">
                      {website.deploymentUrl && (
                        <a
                          href={website.deploymentUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-green-600 hover:underline text-sm"
                        >
                          🔗 {website.deploymentUrl}
                        </a>
                      )}
                      <p className="text-xs text-gray-500 mt-1">
                        Published: {website.deployedAt ? new Date(website.deployedAt).toLocaleDateString() : 'N/A'}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
