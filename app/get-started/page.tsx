'use client';

import { BusinessForm } from '@/components/forms/business-form';

export default function GetStartedPage() {
  return (
    <div className="min-h-screen pt-20">
      <div className="container-lg py-12">
        <div className="max-w-2xl mx-auto">
          <div className="mb-8">
            <h1 className="text-4xl font-bold mb-4">Get Your Website Built</h1>
            <p className="text-gray-600 text-lg">
              Tell us about your business and our AI will create a stunning website in minutes.
            </p>
          </div>

          <BusinessForm />

          <div className="mt-8 text-center text-sm text-gray-500">
            <p>Your information is secure and will only be used to create your website.</p>
          </div>
        </div>
      </div>
    </div>
  );
}
