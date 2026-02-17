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

interface AnalyticsOverview {
  totalUsers: number
  activeUsers: number
  sessions: number
  pageViews: number
  bounceRate: number
  avgSessionDuration: string
}

interface CountryData {
  country: string
  countryCode: string
  users: number
  sessions: number
}

interface EventData {
  eventName: string
  eventCount: number
}

interface TrafficSource {
  source: string
  medium: string
  users: number
  sessions: number
}

interface DeviceData {
  deviceCategory: string
  users: number
  percentage: number
}

interface FormSubmission {
  id: string
  businessName: string
  email: string
  phone: string | null
  country: string
  createdAt: string
  status: string
  websiteType: string | null
  generatedWebsite: {
    id: string
    isPublished: boolean
    createdAt: string
  } | null
}

interface SubmissionStats {
  total: number
  pending: number
  completed: number
  published: number
  todaySubmissions: number
  thisWeekSubmissions: number
  thisMonthSubmissions: number
}

interface AnalyticsData {
  overview: AnalyticsOverview
  countries: CountryData[]
  events: EventData[]
  trafficSources: TrafficSource[]
  devices: DeviceData[]
  submissions: FormSubmission[]
  submissionStats: SubmissionStats
  submissionCountries: { country: string; count: number }[]
}

type TabType = 'approvals' | 'analytics' | 'submissions'

export default function SalesDashboard() {
  const [secret, setSecret] = useState("")
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [loading, setLoading] = useState(false)
  const [websites, setWebsites] = useState<WebsitesData | null>(null)
  const [summary, setSummary] = useState<Summary | null>(null)
  const [error, setError] = useState("")
  const [successMessage, setSuccessMessage] = useState("")
  const [approvingId, setApprovingId] = useState<string | null>(null)
  const [activeTab, setActiveTab] = useState<TabType>('approvals')
  
  // Analytics state
  const [analyticsData, setAnalyticsData] = useState<AnalyticsData | null>(null)
  const [analyticsLoading, setAnalyticsLoading] = useState(false)
  const [dateRange, setDateRange] = useState<'7' | '30' | '90'>('30')

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

  const fetchAnalytics = async () => {
    setAnalyticsLoading(true)
    
    try {
      const startDate = `${dateRange}daysAgo`
      const response = await fetch(`/api/admin/analytics?secret=${secret}&startDate=${startDate}&endDate=today`)
      const data = await response.json()
      
      if (!response.ok) {
        throw new Error(data.error || "Failed to fetch analytics")
      }
      
      setAnalyticsData(data.data)
    } catch (err) {
      console.error('Analytics error:', err)
      // Don't show error to user, just use mock data
    } finally {
      setAnalyticsLoading(false)
    }
  }

  useEffect(() => {
    if (isAuthenticated && activeTab === 'analytics') {
      fetchAnalytics()
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isAuthenticated, activeTab, dateRange])

  useEffect(() => {
    if (isAuthenticated && activeTab === 'submissions') {
      fetchAnalytics()
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isAuthenticated, activeTab])

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
      
      setSuccessMessage(`${businessName} has been approved! Customer can now publish.`)
      
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

  const getCountryFlag = (countryCode: string): string => {
    try {
      const codePoints = countryCode
        .toUpperCase()
        .split('')
        .map(char => 127397 + char.charCodeAt(0))
      return String.fromCodePoint(...codePoints)
    } catch {
      return '🌍'
    }
  }

  const getEventDisplayName = (eventName: string): string => {
    const names: Record<string, string> = {
      'page_view': '📄 Page View',
      'form_start': '📝 Form Started',
      'form_submit': '✅ Form Submitted',
      'generate_lead': '🎯 Lead Generated',
      'publish_click': '🚀 Publish Clicked',
      'session_start': '🔄 Session Start',
      'first_visit': '👋 First Visit',
      'user_engagement': '💬 Engagement',
    }
    return names[eventName] || eventName
  }

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
        <div className="bg-white rounded-xl shadow-lg p-8 max-w-md w-full">
          <h1 className="text-2xl font-bold text-gray-900 mb-6 text-center">
            Sales Dashboard
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
    <div className="min-h-screen bg-gray-100">
      {/* Header */}
      <div className="bg-white border-b sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Sales Dashboard</h1>
              <p className="text-gray-600 text-sm">Bytes Platform Analytics & Management</p>
            </div>
            <button
              onClick={fetchWebsites}
              disabled={loading}
              className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 disabled:opacity-50"
            >
              {loading ? "Refreshing..." : "Refresh"}
            </button>
          </div>

          {/* Tabs */}
          <div className="flex gap-1 mt-4 bg-gray-100 p-1 rounded-lg w-fit">
            <button
              onClick={() => setActiveTab('approvals')}
              className={`px-4 py-2 rounded-md font-medium transition-colors ${
                activeTab === 'approvals' 
                  ? 'bg-white shadow text-indigo-600' 
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              🔔 Approvals
            </button>
            <button
              onClick={() => setActiveTab('analytics')}
              className={`px-4 py-2 rounded-md font-medium transition-colors ${
                activeTab === 'analytics' 
                  ? 'bg-white shadow text-indigo-600' 
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              📊 Analytics
            </button>
            <button
              onClick={() => setActiveTab('submissions')}
              className={`px-4 py-2 rounded-md font-medium transition-colors ${
                activeTab === 'submissions' 
                  ? 'bg-white shadow text-indigo-600' 
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              📝 Submissions
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto p-6">
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

        {/* Analytics Tab */}
        {activeTab === 'analytics' && (
          <div className="space-y-6">
            {/* Date Range Selector */}
            <div className="flex justify-end gap-2">
              {(['7', '30', '90'] as const).map((range) => (
                <button
                  key={range}
                  onClick={() => setDateRange(range)}
                  className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                    dateRange === range
                      ? 'bg-indigo-600 text-white'
                      : 'bg-white text-gray-600 hover:bg-gray-50'
                  }`}
                >
                  {range} Days
                </button>
              ))}
            </div>

            {analyticsLoading ? (
              <div className="text-center py-20">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto"></div>
                <p className="mt-4 text-gray-600">Loading analytics...</p>
              </div>
            ) : analyticsData ? (
              <>
                {/* Form Submission Stats from DB - REAL DATA */}
                {analyticsData.submissionStats && (
                  <div className="bg-gradient-to-r from-indigo-500 to-purple-600 rounded-xl shadow p-6 text-white">
                    <h3 className="text-lg font-bold mb-4">📊 Form Submission Stats (Real Data)</h3>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      <div>
                        <p className="text-4xl font-bold">{analyticsData.submissionStats.total}</p>
                        <p className="text-indigo-100">Total Submissions</p>
                      </div>
                      <div>
                        <p className="text-4xl font-bold">{analyticsData.submissionStats.todaySubmissions}</p>
                        <p className="text-indigo-100">Today</p>
                      </div>
                      <div>
                        <p className="text-4xl font-bold">{analyticsData.submissionStats.thisWeekSubmissions}</p>
                        <p className="text-indigo-100">This Week</p>
                      </div>
                      <div>
                        <p className="text-4xl font-bold">{analyticsData.submissionStats.published}</p>
                        <p className="text-indigo-100">Published</p>
                      </div>
                    </div>
                  </div>
                )}

                {/* Country Breakdown from Phone Numbers - REAL DATA */}
                {analyticsData.submissionCountries && analyticsData.submissionCountries.length > 0 && (
                  <div className="bg-white rounded-xl shadow p-6">
                    <h3 className="text-lg font-bold text-gray-900 mb-4">🌍 Submissions by Country (Real Data - from Phone Numbers)</h3>
                    <div className="flex flex-wrap gap-3">
                      {analyticsData.submissionCountries.map((c, i) => (
                        <div key={i} className="bg-gray-100 px-4 py-2 rounded-full flex items-center gap-2">
                          <span className="font-medium text-gray-800">{c.country}</span>
                          <span className="bg-indigo-600 text-white text-sm px-2 py-0.5 rounded-full">{c.count}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Google Analytics Section */}
                {analyticsData.overview ? (
                  <>
                    {/* Overview Cards */}
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
                      <div className="bg-white rounded-xl p-4 shadow">
                        <p className="text-3xl font-bold text-indigo-600">{analyticsData.overview.totalUsers}</p>
                        <p className="text-sm text-gray-600">Total Users</p>
                      </div>
                      <div className="bg-white rounded-xl p-4 shadow">
                        <p className="text-3xl font-bold text-green-600">{analyticsData.overview.activeUsers}</p>
                        <p className="text-sm text-gray-600">Active Users</p>
                      </div>
                      <div className="bg-white rounded-xl p-4 shadow">
                        <p className="text-3xl font-bold text-blue-600">{analyticsData.overview.sessions}</p>
                        <p className="text-sm text-gray-600">Sessions</p>
                      </div>
                      <div className="bg-white rounded-xl p-4 shadow">
                        <p className="text-3xl font-bold text-purple-600">{analyticsData.overview.pageViews}</p>
                        <p className="text-sm text-gray-600">Page Views</p>
                      </div>
                      <div className="bg-white rounded-xl p-4 shadow">
                        <p className="text-3xl font-bold text-orange-600">{analyticsData.overview.bounceRate.toFixed(1)}%</p>
                        <p className="text-sm text-gray-600">Bounce Rate</p>
                      </div>
                      <div className="bg-white rounded-xl p-4 shadow">
                        <p className="text-3xl font-bold text-gray-700">{analyticsData.overview.avgSessionDuration}</p>
                        <p className="text-sm text-gray-600">Avg Session</p>
                      </div>
                    </div>

                    {/* Countries & Events */}
                    <div className="grid lg:grid-cols-2 gap-6">
                      {/* Countries */}
                      {analyticsData.countries && analyticsData.countries.length > 0 && (
                        <div className="bg-white rounded-xl shadow p-6">
                          <h3 className="text-lg font-bold text-gray-900 mb-4">🌍 Users by Country (GA)</h3>
                          <div className="space-y-3">
                            {analyticsData.countries.map((c, i) => (
                              <div key={i} className="flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                  <span className="text-2xl">{getCountryFlag(c.countryCode)}</span>
                                  <span className="font-medium text-gray-800">{c.country}</span>
                                </div>
                                <div className="text-right">
                                  <span className="font-bold text-gray-900">{c.users}</span>
                                  <span className="text-gray-500 text-sm ml-2">users</span>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Events */}
                      {analyticsData.events && analyticsData.events.length > 0 && (
                        <div className="bg-white rounded-xl shadow p-6">
                          <h3 className="text-lg font-bold text-gray-900 mb-4">📈 Event Tracking (GA)</h3>
                          <div className="space-y-3">
                            {analyticsData.events.slice(0, 8).map((e, i) => (
                              <div key={i} className="flex items-center justify-between">
                                <span className="font-medium text-gray-800">{getEventDisplayName(e.eventName)}</span>
                                <span className="font-bold text-gray-900 bg-gray-100 px-3 py-1 rounded-full">
                                  {e.eventCount.toLocaleString()}
                                </span>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Traffic Sources & Devices */}
                    <div className="grid lg:grid-cols-2 gap-6">
                      {/* Traffic Sources */}
                      {analyticsData.trafficSources && analyticsData.trafficSources.length > 0 && (
                        <div className="bg-white rounded-xl shadow p-6">
                          <h3 className="text-lg font-bold text-gray-900 mb-4">🔗 Traffic Sources (GA)</h3>
                          <div className="space-y-3">
                            {analyticsData.trafficSources.map((t, i) => (
                              <div key={i} className="flex items-center justify-between py-2 border-b border-gray-100 last:border-0">
                                <div>
                                  <p className="font-medium text-gray-800">{t.source}</p>
                                  <p className="text-sm text-gray-500">{t.medium}</p>
                                </div>
                                <div className="text-right">
                                  <p className="font-bold text-gray-900">{t.sessions} sessions</p>
                                  <p className="text-sm text-gray-500">{t.users} users</p>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Devices */}
                      {analyticsData.devices && analyticsData.devices.length > 0 && (
                        <div className="bg-white rounded-xl shadow p-6">
                          <h3 className="text-lg font-bold text-gray-900 mb-4">📱 Devices (GA)</h3>
                          <div className="space-y-4">
                            {analyticsData.devices.map((d, i) => (
                              <div key={i}>
                                <div className="flex justify-between mb-1">
                                  <span className="font-medium text-gray-800 capitalize">
                                    {d.deviceCategory === 'mobile' ? '📱' : d.deviceCategory === 'desktop' ? '💻' : '📟'} {d.deviceCategory}
                                  </span>
                                  <span className="font-bold text-gray-900">{d.percentage}%</span>
                                </div>
                                <div className="w-full bg-gray-200 rounded-full h-3">
                                  <div 
                                    className="bg-indigo-600 h-3 rounded-full transition-all"
                                    style={{ width: `${d.percentage}%` }}
                                  ></div>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  </>
                ) : (
                  <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-6">
                    <h3 className="text-lg font-bold text-yellow-800 mb-2">⚠️ Google Analytics Not Connected</h3>
                    <p className="text-yellow-700 mb-4">
                      Traffic data (Users, Sessions, Countries, Devices) requires Google Analytics API setup with a Service Account.
                    </p>
                    <p className="text-yellow-700 text-sm">
                      The submission stats above are from your database and are <strong>100% real</strong>.
                    </p>
                  </div>
                )}
              </>
            ) : (
              <div className="text-center py-20 text-gray-500">
                No analytics data available
              </div>
            )}
          </div>
        )}

        {/* Submissions Tab */}
        {activeTab === 'submissions' && (
          <div className="space-y-6">
            {/* Country Breakdown */}
            {analyticsData?.submissionCountries && (
              <div className="bg-white rounded-xl shadow p-6">
                <h3 className="text-lg font-bold text-gray-900 mb-4">🌍 Submissions by Country</h3>
                <div className="flex flex-wrap gap-3">
                  {analyticsData.submissionCountries.map((c, i) => (
                    <div key={i} className="bg-gray-100 px-4 py-2 rounded-full flex items-center gap-2">
                      <span className="font-medium text-gray-800">{c.country}</span>
                      <span className="bg-indigo-600 text-white text-sm px-2 py-0.5 rounded-full">{c.count}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Submissions Table */}
            <div className="bg-white rounded-xl shadow overflow-hidden">
              <div className="px-6 py-4 border-b bg-gray-50">
                <h3 className="text-lg font-bold text-gray-900">📝 Form Submissions</h3>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50 border-b">
                    <tr>
                      <th className="px-4 py-3 text-left text-sm font-semibold text-gray-900">Business</th>
                      <th className="px-4 py-3 text-left text-sm font-semibold text-gray-900">Email</th>
                      <th className="px-4 py-3 text-left text-sm font-semibold text-gray-900">Phone</th>
                      <th className="px-4 py-3 text-left text-sm font-semibold text-gray-900">Country</th>
                      <th className="px-4 py-3 text-left text-sm font-semibold text-gray-900">Type</th>
                      <th className="px-4 py-3 text-left text-sm font-semibold text-gray-900">Status</th>
                      <th className="px-4 py-3 text-left text-sm font-semibold text-gray-900">Date</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y">
                    {analyticsData?.submissions?.map((sub) => (
                      <tr key={sub.id} className="hover:bg-gray-50">
                        <td className="px-4 py-3 font-medium text-gray-900">{sub.businessName}</td>
                        <td className="px-4 py-3">
                          <a href={`mailto:${sub.email}`} className="text-indigo-600 hover:underline">
                            {sub.email}
                          </a>
                        </td>
                        <td className="px-4 py-3">
                          {sub.phone ? (
                            <a href={`tel:${sub.phone}`} className="text-indigo-600 hover:underline font-mono">
                              {sub.phone}
                            </a>
                          ) : (
                            <span className="text-gray-400">-</span>
                          )}
                        </td>
                        <td className="px-4 py-3 text-gray-700">{sub.country}</td>
                        <td className="px-4 py-3">
                          <span className="bg-gray-100 text-gray-700 px-2 py-1 rounded text-sm">
                            {sub.websiteType || 'N/A'}
                          </span>
                        </td>
                        <td className="px-4 py-3">
                          <span className={`px-2 py-1 rounded-full text-sm font-medium ${
                            sub.status === 'completed' 
                              ? 'bg-green-100 text-green-700'
                              : sub.status === 'pending'
                              ? 'bg-orange-100 text-orange-700'
                              : 'bg-gray-100 text-gray-700'
                          }`}>
                            {sub.status}
                          </span>
                          {sub.generatedWebsite?.isPublished && (
                            <span className="ml-2 text-green-600">✓ Published</span>
                          )}
                        </td>
                        <td className="px-4 py-3 text-gray-500 text-sm">
                          {new Date(sub.createdAt).toLocaleDateString()}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              {(!analyticsData?.submissions || analyticsData.submissions.length === 0) && (
                <div className="text-center py-8 text-gray-500">
                  No submissions found
                </div>
              )}
            </div>
          </div>
        )}

        {/* Approvals Tab */}
        {activeTab === 'approvals' && (
          <>
            {/* Summary Cards */}
            {summary && (
              <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-8">
                <div className="bg-white rounded-xl p-4 shadow">
                  <p className="text-3xl font-bold text-gray-900">{summary.total}</p>
                  <p className="text-sm text-gray-600">Total Websites</p>
                </div>
                <div className="bg-orange-50 border-2 border-orange-200 rounded-xl p-4">
                  <p className="text-3xl font-bold text-orange-600">{summary.pendingApproval}</p>
                  <p className="text-sm text-orange-700">Pending Approval</p>
                </div>
                <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
                  <p className="text-3xl font-bold text-blue-600">{summary.approved}</p>
                  <p className="text-sm text-blue-700">Approved</p>
                </div>
                <div className="bg-green-50 border border-green-200 rounded-xl p-4">
                  <p className="text-3xl font-bold text-green-600">{summary.published}</p>
                  <p className="text-sm text-green-700">Published</p>
                </div>
                <div className="bg-gray-50 border border-gray-200 rounded-xl p-4">
                  <p className="text-3xl font-bold text-gray-600">{summary.ready}</p>
                  <p className="text-sm text-gray-600">Ready</p>
                </div>
              </div>
            )}

            {/* Pending Approval Section - Most Important */}
            <div className="bg-white rounded-xl shadow-lg mb-8">
              <div className="bg-orange-500 text-white px-6 py-4 rounded-t-xl">
                <h2 className="text-xl font-bold flex items-center gap-2">
                  Pending Approval ({websites?.pendingApproval.length || 0})
                </h2>
                <p className="text-orange-100 text-sm">These customers have clicked &quot;Publish&quot; and are waiting for your call</p>
              </div>
              
              <div className="p-6">
                {websites?.pendingApproval.length === 0 ? (
                  <p className="text-gray-500 text-center py-8">No pending approvals at the moment</p>
                ) : (
                  <div className="space-y-4">
                    {websites?.pendingApproval.map((website) => (
                      <div key={website.id} className="border-2 border-orange-200 rounded-lg p-4 bg-orange-50">
                        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                          <div className="flex-1">
                            <h3 className="text-lg font-bold text-gray-900">{website.businessName}</h3>
                            <div className="mt-2 space-y-1 text-sm">
                              <p><span className="text-gray-500">Email:</span> <a href={`mailto:${website.customerEmail}`} className="text-indigo-600 hover:underline">{website.customerEmail}</a></p>
                              {website.customerPhone && (
                                <p><span className="text-gray-500">Phone:</span> <a href={`tel:${website.customerPhone}`} className="text-indigo-600 hover:underline font-bold text-lg">{website.customerPhone}</a></p>
                              )}
                              <p><span className="text-gray-500">Username:</span> <code className="bg-white px-2 py-1 rounded">{website.username}</code></p>
                              <p><span className="text-gray-500">Requested:</span> {website.publishRequestedAt ? new Date(website.publishRequestedAt).toLocaleString() : 'N/A'}</p>
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
                                Preview
                              </a>
                            )}
                            <button
                              onClick={() => handleApprove(website.id, website.businessName)}
                              disabled={approvingId === website.id}
                              className="bg-green-600 text-white px-6 py-3 rounded-lg font-bold hover:bg-green-700 disabled:opacity-50 transition-colors"
                            >
                              {approvingId === website.id ? "Approving..." : "Approve for Publish"}
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
                <h2 className="text-xl font-bold">Approved ({websites?.approved.length || 0})</h2>
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
                <h2 className="text-xl font-bold">Published ({websites?.published.length || 0})</h2>
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
                              {website.deploymentUrl}
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
          </>
        )}
      </div>
    </div>
  )
}
