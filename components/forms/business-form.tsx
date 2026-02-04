'use client';

import { useState } from 'react';
import { FormSubmissionData, Testimonial, BrandColors, TemplateType, TEMPLATE_OPTIONS } from '@/types/forms';

const COLOR_PRESETS = [
  { name: 'Modern Blue', primary: '#3B82F6', secondary: '#1E40AF', accent: '#60A5FA' },
  { name: 'Forest', primary: '#059669', secondary: '#065F46', accent: '#34D399' },
  { name: 'Sunset', primary: '#F97316', secondary: '#EA580C', accent: '#FDBA74' },
  { name: 'Ocean', primary: '#0891B2', secondary: '#164E63', accent: '#06B6D4' },
  { name: 'Elegant', primary: '#7C3AED', secondary: '#5B21B6', accent: '#C4B5FD' },
  { name: 'Fresh', primary: '#EC4899', secondary: '#BE185D', accent: '#F472B6' },
];

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
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [newTestimonial, setNewTestimonial] = useState({ authorName: '', authorRole: '', quote: '' });
  const [brandColors, setBrandColors] = useState<BrandColors>({
    primary: '#3B82F6',
    secondary: '#1E40AF',
    accent: '#60A5FA',
  });
  const [selectedAdditionalImages, setSelectedAdditionalImages] = useState<File[]>([]);
  const [selectedTemplate, setSelectedTemplate] = useState<TemplateType>('dark');

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleAddTestimonial = () => {
    if (!newTestimonial.quote.trim()) {
      setError('Please enter a testimonial quote');
      return;
    }
    if (!newTestimonial.authorName.trim()) {
      setError('Please enter author name');
      return;
    }
    
    setTestimonials([...testimonials, newTestimonial]);
    setNewTestimonial({ authorName: '', authorRole: '', quote: '' });
    setError(null);
  };

  const handleRemoveTestimonial = (index: number) => {
    setTestimonials(testimonials.filter((_, i) => i !== index));
  };

  const handleColorPreset = (preset: typeof COLOR_PRESETS[0]) => {
    setBrandColors({
      primary: preset.primary,
      secondary: preset.secondary,
      accent: preset.accent,
    });
  };

  const handleColorChange = (field: keyof BrandColors, value: string) => {
    setBrandColors(prev => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleAdditionalImagesChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    setSelectedAdditionalImages(files);
  };

  const removeAdditionalImage = (index: number) => {
    const newFiles = selectedAdditionalImages.filter((_, i) => i !== index);
    setSelectedAdditionalImages(newFiles);
    // Update the file input
    const additionalInput = document.getElementById('additionalImages') as HTMLInputElement;
    if (additionalInput) {
      const dataTransfer = new DataTransfer();
      newFiles.forEach(file => dataTransfer.items.add(file));
      additionalInput.files = dataTransfer.files;
    }
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

      // Append template type
      submitFormData.append('templateType', selectedTemplate);

      // Append testimonials if any exist
      if (testimonials.length > 0) {
        submitFormData.append('testimonials', JSON.stringify(testimonials));
      }

      // Append brand colors
      submitFormData.append('brandColors', JSON.stringify(brandColors));

      // Handle file uploads
      const logoInput = document.getElementById('logo') as HTMLInputElement;
      const heroInput = document.getElementById('heroImage') as HTMLInputElement;

      if (logoInput?.files?.[0]) {
        submitFormData.append('logo', logoInput.files[0]);
      }

      if (heroInput?.files?.[0]) {
        submitFormData.append('heroImage', heroInput.files[0]);
      }

      // Use state instead of DOM to ensure consistency
      if (selectedAdditionalImages.length > 0) {
        submitFormData.append('additionalImagesCount', selectedAdditionalImages.length.toString());
        selectedAdditionalImages.forEach((file, index) => {
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

      {/* Template Selection */}
      <div className="bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 p-6 rounded-xl border border-indigo-100">
        <h3 className="text-lg font-bold text-gray-900 mb-2 flex items-center gap-2">
          <span className="text-2xl">🎨</span> Choose Your Website Style
        </h3>
        <p className="text-sm text-gray-600 mb-4">Select a template that matches your brand vibe</p>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {TEMPLATE_OPTIONS.map((template) => (
            <button
              key={template.id}
              type="button"
              onClick={() => setSelectedTemplate(template.id)}
              className={`relative p-5 rounded-xl text-left transition-all duration-300 transform hover:scale-[1.02] ${
                selectedTemplate === template.id
                  ? 'ring-2 ring-indigo-500 shadow-lg shadow-indigo-200/50'
                  : 'border-2 border-gray-200 hover:border-indigo-300'
              } ${template.id === 'dark' ? 'bg-gradient-to-br from-gray-900 to-gray-800' : 'bg-white'}`}
            >
              {/* Selection badge */}
              {selectedTemplate === template.id && (
                <div className="absolute -top-2 -right-2 w-6 h-6 bg-indigo-500 rounded-full flex items-center justify-center shadow-lg">
                  <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
              )}
              
              {/* Template preview header */}
              <div className="flex items-center gap-3 mb-3">
                <span className="text-3xl">{template.preview}</span>
                <div>
                  <h4 className={`font-bold ${template.id === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                    {template.name}
                  </h4>
                  <p className={`text-xs ${template.id === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>
                    {template.id === 'dark' ? 'Premium Dark Theme' : 'Premium Light Theme'}
                  </p>
                </div>
              </div>
              
              {/* Description */}
              <p className={`text-sm mb-3 ${template.id === 'dark' ? 'text-gray-300' : 'text-gray-600'}`}>
                {template.description}
              </p>
              
              {/* Color preview dots */}
              <div className="flex items-center gap-2">
                <span className={`text-xs ${template.id === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>Colors:</span>
                <div className="flex gap-1.5">
                  {template.colors.map((color, i) => (
                    <div
                      key={i}
                      className="w-5 h-5 rounded-full border border-white/20 shadow-sm"
                      style={{ backgroundColor: color }}
                    />
                  ))}
                </div>
              </div>
              
              {/* Features preview */}
              <div className={`mt-3 pt-3 border-t ${template.id === 'dark' ? 'border-gray-700' : 'border-gray-100'}`}>
                <div className="flex flex-wrap gap-1.5">
                  {template.id === 'dark' ? (
                    <>
                      <span className="px-2 py-0.5 bg-indigo-500/20 text-indigo-300 text-xs rounded-full">Glassmorphism</span>
                      <span className="px-2 py-0.5 bg-purple-500/20 text-purple-300 text-xs rounded-full">Neon Accents</span>
                      <span className="px-2 py-0.5 bg-pink-500/20 text-pink-300 text-xs rounded-full">3D Effects</span>
                    </>
                  ) : (
                    <>
                      <span className="px-2 py-0.5 bg-blue-100 text-blue-700 text-xs rounded-full">Gradient Mesh</span>
                      <span className="px-2 py-0.5 bg-purple-100 text-purple-700 text-xs rounded-full">Fluid Motion</span>
                      <span className="px-2 py-0.5 bg-pink-100 text-pink-700 text-xs rounded-full">3D Parallax</span>
                    </>
                  )}
                </div>
              </div>
            </button>
          ))}
        </div>
        
        <p className="text-xs text-center text-gray-500 mt-4">
          ✨ More templates coming soon! We're constantly adding new designs.
        </p>
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
          Additional Images (Optional) - 📸 Select Multiple
        </label>
        <div className="relative">
          <input
            id="additionalImages"
            type="file"
            multiple={true}
            accept="image/*"
            onChange={handleAdditionalImagesChange}
            className="w-full px-4 py-2 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:border-blue-400 transition"
          />
          <p className="absolute top-2 right-4 text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded pointer-events-none">
            Hold Ctrl/Cmd to select multiple
          </p>
        </div>
        <p className="text-sm text-gray-500 mt-2">
          ✅ You can select up to 10 images at once. Max 5MB each.
        </p>

        {/* Preview of selected images */}
        {selectedAdditionalImages.length > 0 && (
          <div className="mt-4 p-4 bg-green-50 border border-green-200 rounded-lg">
            <p className="text-sm font-semibold text-green-900 mb-3">
              ✅ {selectedAdditionalImages.length} Image{selectedAdditionalImages.length !== 1 ? 's' : ''} Selected for Gallery
            </p>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
              {selectedAdditionalImages.map((file, index) => (
                <div key={index} className="relative group">
                  <img
                    src={URL.createObjectURL(file)}
                    alt={`Preview ${index + 1}`}
                    className="w-full h-24 object-cover rounded-lg border-2 border-green-300"
                  />
                  <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-50 rounded-lg transition flex items-center justify-center opacity-0 group-hover:opacity-100">
                    <button
                      type="button"
                      onClick={() => removeAdditionalImage(index)}
                      className="bg-red-600 text-white p-2 rounded-full hover:bg-red-700 transition"
                      title="Remove image"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  </div>
                  <p className="text-xs text-gray-600 mt-1 truncate">{file.name}</p>
                </div>
              ))}
            </div>
            <p className="text-xs text-green-700 mt-3">
              💡 These {selectedAdditionalImages.length} image{selectedAdditionalImages.length !== 1 ? 's' : ''} will appear in the Gallery section of your website
            </p>
          </div>
        )}
      </div>

      {/* Brand Colors Section */}
      <div className="bg-gray-50 p-6 rounded-lg border border-gray-200">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Brand Colors (Optional)</h3>
        <p className="text-sm text-gray-600 mb-4">Choose your brand colors. If not specified, we'll extract them from your logo.</p>

        {/* Color Presets */}
        <div className="mb-6">
          <label className="block text-sm font-semibold text-gray-700 mb-3">Quick Presets</label>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
            {COLOR_PRESETS.map((preset) => (
              <button
                key={preset.name}
                type="button"
                onClick={() => handleColorPreset(preset)}
                className="p-3 border-2 rounded-lg transition hover:border-blue-500"
                style={{
                  borderColor: brandColors.primary === preset.primary ? '#3B82F6' : '#E5E7EB',
                }}
              >
                <div className="flex items-center gap-2 mb-2">
                  <div
                    className="w-4 h-4 rounded"
                    style={{ backgroundColor: preset.primary }}
                  />
                  <div
                    className="w-4 h-4 rounded"
                    style={{ backgroundColor: preset.secondary }}
                  />
                  <div
                    className="w-4 h-4 rounded"
                    style={{ backgroundColor: preset.accent }}
                  />
                </div>
                <span className="text-xs font-medium text-gray-700">{preset.name}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Custom Colors */}
        <div className="space-y-3">
          {/* Primary Color */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Primary Color</label>
            <div className="flex gap-3">
              <input
                type="color"
                value={brandColors.primary}
                onChange={(e) => handleColorChange('primary', e.target.value)}
                className="w-12 h-10 rounded cursor-pointer border border-gray-300"
              />
              <input
                type="text"
                value={brandColors.primary}
                onChange={(e) => handleColorChange('primary', e.target.value)}
                placeholder="#3B82F6"
                className="flex-1 px-3 py-2 border border-gray-300 rounded-lg text-sm font-mono"
              />
            </div>
          </div>

          {/* Secondary Color */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Secondary Color</label>
            <div className="flex gap-3">
              <input
                type="color"
                value={brandColors.secondary}
                onChange={(e) => handleColorChange('secondary', e.target.value)}
                className="w-12 h-10 rounded cursor-pointer border border-gray-300"
              />
              <input
                type="text"
                value={brandColors.secondary}
                onChange={(e) => handleColorChange('secondary', e.target.value)}
                placeholder="#1E40AF"
                className="flex-1 px-3 py-2 border border-gray-300 rounded-lg text-sm font-mono"
              />
            </div>
          </div>

          {/* Accent Color */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Accent Color</label>
            <div className="flex gap-3">
              <input
                type="color"
                value={brandColors.accent}
                onChange={(e) => handleColorChange('accent', e.target.value)}
                className="w-12 h-10 rounded cursor-pointer border border-gray-300"
              />
              <input
                type="text"
                value={brandColors.accent}
                onChange={(e) => handleColorChange('accent', e.target.value)}
                placeholder="#60A5FA"
                className="flex-1 px-3 py-2 border border-gray-300 rounded-lg text-sm font-mono"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Testimonials Section */}
      <div className="bg-blue-50 p-6 rounded-lg border border-blue-200">
        <h3 className="text-lg font-semibold text-gray-900 mb-2">Customer Testimonials (Optional)</h3>
        <p className="text-sm text-gray-600 mb-4">Add real customer testimonials to build trust. Leave empty if you don't have any yet.</p>

        {/* Existing Testimonials */}
        {testimonials.length > 0 && (
          <div className="mb-6 space-y-3">
            {testimonials.map((testimonial, index) => (
              <div key={index} className="bg-white p-4 rounded-lg border border-blue-200">
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <p className="font-semibold text-gray-900">{testimonial.authorName}</p>
                    {testimonial.authorRole && (
                      <p className="text-sm text-gray-600">{testimonial.authorRole}</p>
                    )}
                  </div>
                  <button
                    type="button"
                    onClick={() => handleRemoveTestimonial(index)}
                    className="text-red-600 hover:text-red-700 text-sm font-medium"
                  >
                    Remove
                  </button>
                </div>
                <p className="text-gray-700 text-sm italic">"{testimonial.quote}"</p>
              </div>
            ))}
          </div>
        )}

        {/* Add New Testimonial */}
        <div className="bg-white p-4 rounded-lg border border-blue-200 space-y-3">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Author Name</label>
            <input
              type="text"
              value={newTestimonial.authorName}
              onChange={(e) => setNewTestimonial({ ...newTestimonial, authorName: e.target.value })}
              placeholder="John Smith"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Author Role (Optional)</label>
            <input
              type="text"
              value={newTestimonial.authorRole}
              onChange={(e) => setNewTestimonial({ ...newTestimonial, authorRole: e.target.value })}
              placeholder="e.g., Owner, Manager, Customer"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Testimonial Quote</label>
            <textarea
              value={newTestimonial.quote}
              onChange={(e) => setNewTestimonial({ ...newTestimonial, quote: e.target.value })}
              placeholder="What they said about your business..."
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          <button
            type="button"
            onClick={handleAddTestimonial}
            className="w-full bg-blue-600 text-white font-medium py-2 px-4 rounded-lg hover:bg-blue-700 transition"
          >
            Add Testimonial
          </button>
        </div>
      </div>
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
