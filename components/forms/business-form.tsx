'use client';

import { useState } from 'react';
import { FormSubmissionData } from '@/types/forms';

export function BusinessForm() {
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [formData, setFormData] = useState<FormSubmissionData>({
    businessName: '',
    tagline: '',
    about: '',
    industry: '',
    services: [],
    email: '',
    phone: '',
    address: '',
  });
  const [services, setServices] = useState('');

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      // Validate required fields
      if (!formData.businessName.trim()) {
        throw new Error('Business name is required');
      }
      if (!formData.about.trim()) {
        throw new Error('About your business is required');
      }
      if (!formData.email.trim()) {
        throw new Error('Email is required');
      }

      const servicesList = services
        .split(',')
        .map(s => s.trim())
        .filter(s => s.length > 0);

      if (servicesList.length === 0) {
        throw new Error('Please add at least one service');
      }

      // Create FormData for file upload
      const submitFormData = new FormData();
      submitFormData.append('businessName', formData.businessName);
      submitFormData.append('tagline', formData.tagline || '');
      submitFormData.append('about', formData.about);
      submitFormData.append('industry', formData.industry || '');
      submitFormData.append('services', JSON.stringify(servicesList));
      submitFormData.append('email', formData.email);
      submitFormData.append('phone', formData.phone || '');
      submitFormData.append('address', formData.address || '');

      // Handle file uploads
      const logoInput = document.getElementById('logo') as HTMLInputElement;
      const heroInput = document.getElementById('heroImage') as HTMLInputElement;
      const additionalInput = document.getElementById('additionalImages') as HTMLInputElement;

      if (logoInput?.files?.[0]) {
        submitFormData.append('logo', logoInput.files[0]);
      }

      if (heroInput?.files?.[0]) {
        submitFormData.append('heroImage', heroInput.files[0]);
      }

      if (additionalInput?.files) {
        submitFormData.append('additionalImagesCount', additionalInput.files.length.toString());
        Array.from(additionalInput.files).forEach((file, index) => {
          submitFormData.append(`additionalImage_${index}`, file);
        });
      }

      // Submit form
      const response = await fetch('/api/form', {
        method: 'POST',
        body: submitFormData,
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to submit form');
      }

      setSubmitted(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  if (submitted) {
    return (
      <div className="text-center py-12 px-6">
        <div className="max-w-md mx-auto">
          <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <svg className="w-10 h-10 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h2 className="text-3xl font-bold text-gray-900 mb-4">Your Website is Being Generated!</h2>
          <p className="text-lg text-gray-600 mb-6">
            Our AI is working on creating your stunning website. This may take a few minutes.
          </p>
          <div className="bg-blue-50 border border-blue-200 rounded-xl p-6 text-left">
            <h3 className="font-semibold text-blue-900 mb-3">What happens next?</h3>
            <ul className="space-y-3 text-blue-800">
              <li className="flex items-start gap-3">
                <span className="flex-shrink-0 w-6 h-6 bg-blue-200 rounded-full flex items-center justify-center text-sm font-medium">1</span>
                <span>Our team will receive your website details</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="flex-shrink-0 w-6 h-6 bg-blue-200 rounded-full flex items-center justify-center text-sm font-medium">2</span>
                <span>You'll receive login credentials via email or phone</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="flex-shrink-0 w-6 h-6 bg-blue-200 rounded-full flex items-center justify-center text-sm font-medium">3</span>
                <span>Login to preview, customize, and publish your website</span>
              </li>
            </ul>
          </div>
          <p className="text-gray-500 mt-6 text-sm">
            We'll be in touch soon! If you have questions, reach out to our team.
          </p>
        </div>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="max-w-2xl mx-auto space-y-6">
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
          {error}
        </div>
      )}

      {/* Business Name */}
      <div>
        <label className="block text-sm font-semibold text-gray-700 mb-2">
          Business Name *
        </label>
        <input
          type="text"
          name="businessName"
          value={formData.businessName}
          onChange={handleInputChange}
          placeholder="e.g., ABC Plumbing Services"
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          required
        />
      </div>

      {/* Tagline */}
      <div>
        <label className="block text-sm font-semibold text-gray-700 mb-2">
          Tagline (Optional)
        </label>
        <input
          type="text"
          name="tagline"
          value={formData.tagline}
          onChange={handleInputChange}
          placeholder="e.g., Quality plumbing solutions since 1995"
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        />
      </div>

      {/* About */}
      <div>
        <label className="block text-sm font-semibold text-gray-700 mb-2">
          About Your Business *
        </label>
        <textarea
          name="about"
          value={formData.about}
          onChange={handleInputChange}
          placeholder="Tell us about your business, your story, what you do..."
          rows={4}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          required
        />
      </div>

      {/* Industry */}
      <div>
        <label className="block text-sm font-semibold text-gray-700 mb-2">
          Industry (Optional)
        </label>
        <select
          name="industry"
          value={formData.industry}
          onChange={handleInputChange}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        >
          <option value="">Select an industry</option>
          <option value="plumbing">Plumbing</option>
          <option value="electrical">Electrical</option>
          <option value="hvac">HVAC</option>
          <option value="landscaping">Landscaping</option>
          <option value="roofing">Roofing</option>
          <option value="restaurant">Restaurant</option>
          <option value="salon">Salon/Spa</option>
          <option value="consulting">Consulting</option>
          <option value="ecommerce">E-Commerce</option>
          <option value="other">Other</option>
        </select>
      </div>

      {/* Services */}
      <div>
        <label className="block text-sm font-semibold text-gray-700 mb-2">
          Services You Offer *
        </label>
        <textarea
          value={services}
          onChange={e => setServices(e.target.value)}
          placeholder="e.g., Emergency repairs, Water heater installation, Drain cleaning"
          rows={3}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          required
        />
        <p className="text-sm text-gray-500 mt-1">Separate services with commas</p>
      </div>

      {/* Email */}
      <div>
        <label className="block text-sm font-semibold text-gray-700 mb-2">
          Email *
        </label>
        <input
          type="email"
          name="email"
          value={formData.email}
          onChange={handleInputChange}
          placeholder="your@email.com"
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          required
        />
      </div>

      {/* Phone */}
      <div>
        <label className="block text-sm font-semibold text-gray-700 mb-2">
          Phone (Optional)
        </label>
        <input
          type="tel"
          name="phone"
          value={formData.phone}
          onChange={handleInputChange}
          placeholder="+1 (555) 000-0000"
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        />
      </div>

      {/* Address */}
      <div>
        <label className="block text-sm font-semibold text-gray-700 mb-2">
          Address (Optional)
        </label>
        <input
          type="text"
          name="address"
          value={formData.address}
          onChange={handleInputChange}
          placeholder="Your business address"
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        />
      </div>

      {/* Logo Upload */}
      <div>
        <label className="block text-sm font-semibold text-gray-700 mb-2">
          Logo (PNG, JPG, SVG)
        </label>
        <input
          id="logo"
          type="file"
          accept="image/*"
          className="w-full px-4 py-2 border border-gray-300 rounded-lg"
        />
        <p className="text-sm text-gray-500 mt-1">Max 5MB. We'll extract your brand colors.</p>
      </div>

      {/* Hero Image Upload */}
      <div>
        <label className="block text-sm font-semibold text-gray-700 mb-2">
          Hero Image (PNG, JPG, WebP)
        </label>
        <input
          id="heroImage"
          type="file"
          accept="image/*"
          className="w-full px-4 py-2 border border-gray-300 rounded-lg"
        />
        <p className="text-sm text-gray-500 mt-1">Max 10MB. This will be your homepage hero section.</p>
      </div>

      {/* Additional Images */}
      <div>
        <label className="block text-sm font-semibold text-gray-700 mb-2">
          Additional Images (Optional)
        </label>
        <input
          id="additionalImages"
          type="file"
          multiple
          accept="image/*"
          className="w-full px-4 py-2 border border-gray-300 rounded-lg"
        />
        <p className="text-sm text-gray-500 mt-1">Up to 10 images. Max 5MB each.</p>
      </div>

      {/* Submit Button */}
      <button
        type="submit"
        disabled={loading}
        className="w-full bg-blue-600 text-white font-semibold py-3 px-6 rounded-lg hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition"
      >
        {loading ? 'Creating Your Website...' : 'Create My Website'}
      </button>
    </form>
  );
}
