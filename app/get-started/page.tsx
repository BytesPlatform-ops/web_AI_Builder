'use client';

import { BusinessForm } from '@/components/forms/business-form';
import { Shield, Clock, CreditCard, Star } from 'lucide-react';

export default function GetStartedPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-indigo-50/40 via-white to-white">
      {/* Trust Bar */}
      <div className="border-b border-gray-100 bg-white/80 backdrop-blur-sm">
        <div className="max-w-3xl mx-auto px-4 py-3 flex items-center justify-center gap-6 sm:gap-10 text-sm text-gray-600">
          <span className="flex items-center gap-1.5">
            <CreditCard className="w-4 h-4 text-green-500" />
            100% Free
          </span>
          <span className="flex items-center gap-1.5">
            <Clock className="w-4 h-4 text-indigo-500" />
            Ready in 2 min
          </span>
          <span className="flex items-center gap-1.5">
            <Shield className="w-4 h-4 text-blue-500" />
            Secure
          </span>
        </div>
      </div>

      <div className="max-w-2xl mx-auto px-4 pt-10 pb-16">
        {/* Header */}
        <div className="text-center mb-10">
          <h1 className="text-4xl sm:text-5xl font-bold text-gray-900 tracking-tight mb-3">
            Build Your Professional Website
          </h1>
          <p className="text-lg text-gray-500 max-w-lg mx-auto">
            Fill out a few details and we&apos;ll create a stunning, ready-to-launch website for your business.
          </p>
        </div>

        {/* Form Card */}
        <div className="bg-white rounded-2xl shadow-xl shadow-gray-200/60 border border-gray-100 p-6 sm:p-8">
          <BusinessForm />
        </div>

        {/* Social Proof */}
        <div className="mt-8 flex flex-col items-center gap-2">
          <div className="flex items-center gap-0.5">
            {[1,2,3,4,5].map(i => (
              <Star key={i} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
            ))}
          </div>
          <p className="text-sm text-gray-500">
            Trusted by <span className="font-semibold text-gray-700">500+</span> small businesses
          </p>
        </div>
      </div>
    </div>
  );
}
