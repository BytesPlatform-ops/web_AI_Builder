"use client"

import { useState } from 'react';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import { useEffect } from 'react';

export default function SubmissionDetailPage() {
  const params = useParams();
  const router = useRouter();
  const [submission, setSubmission] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [sendingEmail, setSendingEmail] = useState(false);
  const [emailSent, setEmailSent] = useState(false);

  useEffect(() => {
    fetchSubmission();
  }, [params.id]);

  const fetchSubmission = async () => {
    try {
      const response = await fetch(`/api/admin/submission/${params.id}`);
      if (response.ok) {
        const data = await response.json();
        setSubmission(data);
      }
    } catch (error) {
      console.error('Failed to fetch submission:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSendCredentials = async () => {
    if (!confirm('Send login credentials to this customer?')) {
      return;
    }

    setSendingEmail(true);
    try {
      const response = await fetch('/api/admin/send-credentials', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ submissionId: params.id }),
      });

      if (response.ok) {
        setEmailSent(true);
        alert('✅ Credentials email sent successfully!');
      } else {
        const error = await response.json();
        alert(`❌ Failed to send email: ${error.message || error.error}`);
      }
    } catch (error) {
      alert('❌ Failed to send email');
      console.error(error);
    } finally {
      setSendingEmail(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  if (!submission) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Submission Not Found</h2>
          <Link href="/dashboard" className="text-indigo-600 hover:text-indigo-700">
            ← Back to Dashboard
          </Link>
        </div>
      </div>
    );
  }

  const website = submission.generatedWebsite;
  const previewUrl = website?.previewUrl || website?.deploymentUrl;

  return (
    <div className="min-h-screen pt-20">
      <div className="container-lg py-12">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold">{submission.businessName}</h1>
            <p className="text-gray-600">Submission ID: {submission.id}</p>
          </div>
          <Link href="/dashboard" className="btn-secondary">Back</Link>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-6">
            <div className="card p-6">
              <h2 className="text-xl font-semibold mb-4">Business Details</h2>
              <div className="space-y-3 text-gray-700">
                <div><strong>Tagline:</strong> {submission.tagline || '—'}</div>
                <div><strong>About:</strong> {submission.about}</div>
                <div><strong>Services:</strong> {submission.services.join(', ')}</div>
                <div><strong>Industry:</strong> {submission.industry || '—'}</div>
                <div><strong>Target Audience:</strong> {submission.targetAudience || '—'}</div>
              </div>
            </div>

            <div className="card p-6">
              <h2 className="text-xl font-semibold mb-4">Contact Info</h2>
              <div className="space-y-2 text-gray-700">
                <div><strong>Email:</strong> {submission.email}</div>
                <div><strong>Phone:</strong> {submission.phone || '—'}</div>
                <div><strong>Address:</strong> {submission.address || '—'}</div>
              </div>
            </div>
          </div>

          <div className="space-y-6">
            <div className="card p-6">
              <h2 className="text-xl font-semibold mb-4">Status</h2>
              <div className="badge badge-primary mb-4">{submission.status}</div>
              {previewUrl ? (
                <a href={previewUrl} target="_blank" rel="noreferrer" className="btn-primary w-full mb-3">Open Preview</a>
              ) : (
                <div className="text-sm text-gray-500 mb-3">Preview not ready yet.</div>
              )}
              
              {/* Send Credentials Button */}
              {submission.status === 'GENERATED' && website && (
                <button
                  onClick={handleSendCredentials}
                  disabled={sendingEmail}
                  className={`w-full px-4 py-3 rounded-lg font-medium transition-colors ${
                    emailSent
                      ? 'bg-green-100 text-green-800 border border-green-300'
                      : sendingEmail
                      ? 'bg-gray-300 text-gray-600 cursor-not-allowed'
                      : 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white hover:from-indigo-700 hover:to-purple-700'
                  }`}
                >
                  {sendingEmail ? (
                    <span className="flex items-center justify-center">
                      <svg className="animate-spin h-5 w-5 mr-2" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Sending...
                    </span>
                  ) : emailSent ? (
                    '✅ Credentials Sent'
                  ) : (
                    '📧 Send Credentials to User'
                  )}
                </button>
              )}
            </div>

            <div className="card p-6">
              <h2 className="text-xl font-semibold mb-4">Files</h2>
              <div className="text-sm text-gray-600">Logo: {submission.logoUrl ? 'Uploaded' : 'None'}</div>
              <div className="text-sm text-gray-600">Hero Image: {submission.heroImageUrl ? 'Uploaded' : 'None'}</div>
              <div className="text-sm text-gray-600">Additional Images: {submission.additionalImages.length}</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
