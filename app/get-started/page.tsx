'use client';

import { BusinessForm } from '@/components/forms/business-form';

export default function GetStartedPage() {
  return (
    <div className="min-h-screen bg-slate-50 pt-20">
      <div className="relative overflow-hidden">
        <div className="pointer-events-none absolute inset-0">
          <div className="absolute -top-24 left-1/2 h-72 w-72 -translate-x-1/2 rounded-full bg-indigo-200/50 blur-3xl" />
          <div className="absolute top-32 right-10 h-64 w-64 rounded-full bg-rose-200/40 blur-3xl" />
        </div>
        <div className="container-lg py-12">
          <div className="max-w-3xl mx-auto">
            <div className="text-center mb-10">
              <span className="inline-flex items-center gap-2 rounded-full bg-white/70 px-4 py-1 text-xs font-semibold uppercase tracking-[0.18em] text-indigo-700 ring-1 ring-indigo-100">
                Website Intake
              </span>
              <h1 className="mt-4 text-4xl font-semibold tracking-tight text-slate-900 md:text-5xl">
                Tell us about your business
              </h1>
              <p className="mt-3 text-lg text-slate-600 leading-relaxed">
                Share a few details and we’ll craft your website. You’ll receive your login credentials once it’s ready.
              </p>
            </div>

            <div className="rounded-3xl bg-white/90 p-6 shadow-xl ring-1 ring-slate-200/70 backdrop-blur md:p-10">
              <BusinessForm />
            </div>

            <div className="mt-6 text-center text-sm text-slate-500">
              <p>Your information is secure and used only to create your website.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
