import Link from 'next/link';
import { prisma } from '@/lib/prisma';

export const dynamic = 'force-dynamic';

export default async function DashboardPage() {
  const submissions = await prisma.formSubmission.findMany({
    orderBy: { createdAt: 'desc' },
    include: { generatedWebsite: true },
  });

  return (
    <div className="min-h-screen pt-20">
      <div className="container-lg py-12">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold">Sales Dashboard</h1>
            <p className="text-gray-600">Review and approve generated websites</p>
          </div>
          <Link href="/generate" className="btn-primary">Create New</Link>
        </div>

        <div className="card overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead className="bg-gray-50 border-b">
                <tr>
                  <th className="px-6 py-3 text-sm font-semibold text-gray-600">Business</th>
                  <th className="px-6 py-3 text-sm font-semibold text-gray-600">Status</th>
                  <th className="px-6 py-3 text-sm font-semibold text-gray-600">Submitted</th>
                  <th className="px-6 py-3 text-sm font-semibold text-gray-600">Preview</th>
                  <th className="px-6 py-3 text-sm font-semibold text-gray-600">Actions</th>
                </tr>
              </thead>
              <tbody>
                {submissions.map((submission) => {
                  const website = submission.generatedWebsite;
                  const previewUrl = website?.previewUrl || website?.deploymentUrl;
                  return (
                    <tr key={submission.id} className="border-b last:border-b-0">
                      <td className="px-6 py-4">
                        <div className="font-semibold text-gray-900">{submission.businessName}</div>
                        <div className="text-sm text-gray-500">{submission.email}</div>
                      </td>
                      <td className="px-6 py-4">
                        <span className="badge badge-primary">
                          {submission.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-600">
                        {new Date(submission.createdAt).toLocaleString()}
                      </td>
                      <td className="px-6 py-4">
                        {previewUrl ? (
                          <a href={previewUrl} target="_blank" rel="noreferrer" className="text-primary-600 hover:underline">
                            View Preview
                          </a>
                        ) : (
                          <span className="text-sm text-gray-400">Not ready</span>
                        )}
                      </td>
                      <td className="px-6 py-4">
                        <Link
                          href={`/dashboard/${submission.id}`}
                          className="btn-secondary btn-sm"
                        >
                          Review
                        </Link>
                      </td>
                    </tr>
                  );
                })}
                {submissions.length === 0 && (
                  <tr>
                    <td colSpan={5} className="px-6 py-12 text-center text-gray-500">
                      No submissions yet. Create your first website.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
