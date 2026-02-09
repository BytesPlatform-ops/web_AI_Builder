'use client';

import React, { useState, useCallback, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ArrowRight,
  ArrowLeft,
  Building2,
  Palette,
  CheckCircle2,
  X,
  ImagePlus,
  FileText,
  Sparkles,
  Plus,
  Trash2,
  ChevronDown,
  ChevronUp,
  Star,
  Loader2,
} from 'lucide-react';
import { FormSubmissionData, Testimonial, BrandColors, TemplateType, TEMPLATE_OPTIONS } from '@/types/forms';

// ─── Constants ───────────────────────────────────────────────────────
const COLOR_PRESETS = [
  { name: 'Modern Blue', primary: '#3B82F6', secondary: '#1E40AF', accent: '#60A5FA' },
  { name: 'Forest', primary: '#059669', secondary: '#065F46', accent: '#34D399' },
  { name: 'Sunset', primary: '#F97316', secondary: '#EA580C', accent: '#FDBA74' },
  { name: 'Ocean', primary: '#0891B2', secondary: '#164E63', accent: '#06B6D4' },
  { name: 'Elegant', primary: '#7C3AED', secondary: '#5B21B6', accent: '#C4B5FD' },
  { name: 'Fresh', primary: '#EC4899', secondary: '#BE185D', accent: '#F472B6' },
];

const STEPS = [
  { id: 1, title: 'Business', subtitle: 'Tell us about you', icon: Building2 },
  { id: 2, title: 'Details', subtitle: 'Services & contact', icon: FileText },
  { id: 3, title: 'Style', subtitle: 'Design & uploads', icon: Palette },
];

const INDUSTRIES = [
  'Restaurant', 'Real Estate', 'Salon/Spa', 'Construction',
  'Plumbing', 'Fitness', 'E-Commerce', 'Healthcare',
  'Consulting', 'Photography', 'Other',
];

// ─── DropZone Component ──────────────────────────────────────────────

function DropZone({
  id,
  label,
  hint,
  accept,
  multiple,
  files,
  onFiles,
  onRemove,
}: {
  id: string;
  label: string;
  hint: string;
  accept: string;
  multiple?: boolean;
  files: File[];
  onFiles: (files: File[]) => void;
  onRemove?: (index: number) => void;
}) {
  const [dragOver, setDragOver] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setDragOver(false);
      const dropped = Array.from(e.dataTransfer.files).filter((f) => f.type.startsWith('image/'));
      if (dropped.length) onFiles(multiple ? [...files, ...dropped] : [dropped[0]]);
    },
    [files, multiple, onFiles]
  );

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selected = Array.from(e.target.files || []);
    if (selected.length) onFiles(multiple ? [...files, ...selected] : [selected[0]]);
    e.target.value = '';
  };

  return (
    <div>
      <label className="block text-sm font-medium text-gray-300 mb-2">{label}</label>
      <div
        onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
        onDragLeave={() => setDragOver(false)}
        onDrop={handleDrop}
        onClick={() => inputRef.current?.click()}
        className={`relative cursor-pointer rounded-xl border-2 border-dashed transition-all duration-200 ${
          dragOver
            ? 'border-indigo-400 bg-indigo-500/10 scale-[1.01]'
            : files.length > 0
            ? 'border-emerald-500/30 bg-emerald-500/5'
            : 'border-white/10 bg-white/[0.04] hover:border-indigo-400/50 hover:bg-white/[0.06]'
        }`}
      >
        <input
          ref={inputRef}
          id={id}
          type="file"
          accept={accept}
          multiple={multiple}
          onChange={handleChange}
          className="hidden"
        />

        {files.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-8 px-4">
            <div className={`w-12 h-12 rounded-xl flex items-center justify-center mb-3 transition-colors ${
              dragOver ? 'bg-indigo-500/20' : 'bg-white/[0.06]'
            }`}>
              <ImagePlus className={`w-6 h-6 ${dragOver ? 'text-indigo-400' : 'text-gray-500'}`} />
            </div>
            <p className="text-sm font-medium text-gray-300">
              Drop {multiple ? 'images' : 'image'} here or <span className="text-indigo-400">browse</span>
            </p>
            <p className="text-xs text-gray-500 mt-1">{hint}</p>
          </div>
        ) : !multiple ? (
          <div className="relative p-3">
            <div className="flex items-center gap-3">
              <img
                src={URL.createObjectURL(files[0])}
                alt="Preview"
                className="w-16 h-16 object-cover rounded-lg border border-white/10"
              />
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-white truncate">{files[0].name}</p>
                <p className="text-xs text-gray-400">{(files[0].size / 1024 / 1024).toFixed(1)} MB</p>
              </div>
              <button
                type="button"
                onClick={(e) => { e.stopPropagation(); onFiles([]); }}
                className="p-1.5 rounded-lg hover:bg-red-50 text-gray-400 hover:text-red-500 transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>
        ) : (
          <div className="p-3" onClick={(e) => e.stopPropagation()}>
            <div className="grid grid-cols-3 sm:grid-cols-4 gap-2 mb-2">
              {files.map((file, i) => (
                <div key={i} className="relative group aspect-square">
                  <img
                    src={URL.createObjectURL(file)}
                    alt={`Preview ${i + 1}`}
                    className="w-full h-full object-cover rounded-lg border border-white/10"
                  />
                  <button
                    type="button"
                    onClick={() => onRemove?.(i)}
                    className="absolute -top-1.5 -right-1.5 w-5 h-5 bg-red-500 text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity shadow-sm"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </div>
              ))}
              <button
                type="button"
                onClick={() => inputRef.current?.click()}
                className="aspect-square rounded-lg border-2 border-dashed border-white/15 flex items-center justify-center hover:border-indigo-400 hover:bg-indigo-500/10 transition-colors"
              >
                <Plus className="w-5 h-5 text-gray-400" />
              </button>
            </div>
            <p className="text-xs text-gray-400">{files.length} image{files.length !== 1 ? 's' : ''} selected</p>
          </div>
        )}
      </div>
    </div>
  );
}

// ─── Main Form ───────────────────────────────────────────────────────

export function BusinessForm() {
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [direction, setDirection] = useState(1);

  // Form state
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
  const [showTestimonials, setShowTestimonials] = useState(false);
  const [showCustomColors, setShowCustomColors] = useState(false);
  const [brandColors, setBrandColors] = useState<BrandColors>({
    primary: '#3B82F6',
    secondary: '#1E40AF',
    accent: '#60A5FA',
  });
  const [selectedTemplate, setSelectedTemplate] = useState<TemplateType>('dark');

  // File state
  const [logoFiles, setLogoFiles] = useState<File[]>([]);
  const [heroFiles, setHeroFiles] = useState<File[]>([]);
  const [galleryFiles, setGalleryFiles] = useState<File[]>([]);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // ─── Validation ───────────────────────────────────────────────────
  const validateStep = (s: number): string | null => {
    if (s === 1) {
      if (!formData.businessName.trim()) return 'Business name is required';
      if (!formData.email.trim()) return 'Email is required';
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(formData.email)) return 'Please enter a valid email';
    }
    if (s === 2) {
      if (!formData.about.trim()) return 'Please tell us about your business';
      const servicesList = services.split(',').map((s) => s.trim()).filter(Boolean);
      if (servicesList.length === 0) return 'Please add at least one service';
    }
    return null;
  };

  const goNext = () => {
    const err = validateStep(step);
    if (err) { setError(err); return; }
    setError(null);
    setDirection(1);
    setStep((s) => Math.min(s + 1, 3));
  };

  const goBack = () => {
    setError(null);
    setDirection(-1);
    setStep((s) => Math.max(s - 1, 1));
  };

  // ─── Testimonials ─────────────────────────────────────────────────
  const handleAddTestimonial = () => {
    if (!newTestimonial.quote.trim() || !newTestimonial.authorName.trim()) return;
    setTestimonials([...testimonials, newTestimonial]);
    setNewTestimonial({ authorName: '', authorRole: '', quote: '' });
  };

  // ─── Submit ───────────────────────────────────────────────────────
  const handleSubmit = async () => {
    const err = validateStep(step);
    if (err) { setError(err); return; }
    setError(null);
    setLoading(true);

    try {
      const servicesList = services.split(',').map((s) => s.trim()).filter(Boolean);
      const submitFormData = new FormData();
      submitFormData.append('businessName', formData.businessName);
      submitFormData.append('tagline', formData.tagline || '');
      submitFormData.append('about', formData.about);
      submitFormData.append('industry', formData.industry || '');
      submitFormData.append('services', JSON.stringify(servicesList));
      submitFormData.append('email', formData.email);
      submitFormData.append('phone', formData.phone || '');
      submitFormData.append('address', formData.address || '');
      submitFormData.append('templateType', selectedTemplate);
      submitFormData.append('brandColors', JSON.stringify(brandColors));

      if (testimonials.length > 0) {
        submitFormData.append('testimonials', JSON.stringify(testimonials));
      }

      if (logoFiles[0]) submitFormData.append('logo', logoFiles[0]);
      if (heroFiles[0]) submitFormData.append('heroImage', heroFiles[0]);

      if (galleryFiles.length > 0) {
        submitFormData.append('additionalImagesCount', galleryFiles.length.toString());
        galleryFiles.forEach((file, index) => {
          submitFormData.append(`additionalImage_${index}`, file);
        });
      }

      const response = await fetch('/api/form', { method: 'POST', body: submitFormData });
      const text = await response.text();
      const data = text ? (() => { try { return JSON.parse(text); } catch { return null; } })() : null;

      if (!response.ok) throw new Error(data?.error || `Submission failed (${response.status})`);
      if (!data) throw new Error('Unexpected response. Please try again.');

      setSubmitted(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  // ─── Success State ────────────────────────────────────────────────
  if (submitted) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="text-center py-12 px-6"
      >
        <div className="max-w-md mx-auto">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: 'spring', stiffness: 200, delay: 0.1 }}
            className="w-20 h-20 bg-gradient-to-br from-green-400 to-emerald-500 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg shadow-green-500/25"
          >
            <CheckCircle2 className="w-10 h-10 text-white" />
          </motion.div>

          <motion.h2
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-3xl font-bold text-white mb-3"
          >
            Your website is being built!
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="text-lg text-gray-400 mb-8"
          >
            We&apos;ll send your login credentials to<br />
            <span className="font-semibold text-white">{formData.email}</span>
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="bg-white/[0.04] border border-white/10 rounded-2xl p-6 text-left"
          >
            <h3 className="font-semibold text-white mb-4">What happens next</h3>
            <div className="space-y-4">
              {[
                { num: '1', text: 'Your website is being generated now', sub: 'This takes about 2 minutes' },
                { num: '2', text: 'You\'ll receive login credentials via email', sub: 'Check your inbox shortly' },
                { num: '3', text: 'Login to preview and publish your website', sub: 'Make it live with one click' },
              ].map((item, i) => (
                <div key={i} className="flex items-start gap-3">
                  <span className="flex-shrink-0 w-7 h-7 bg-indigo-500/20 text-indigo-400 rounded-full flex items-center justify-center text-sm font-bold">
                    {item.num}
                  </span>
                  <div>
                    <p className="text-sm font-medium text-gray-200">{item.text}</p>
                    <p className="text-xs text-gray-500">{item.sub}</p>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </motion.div>
    );
  }

  // ─── Slide animation ──────────────────────────────────────────────
  const slideVariants = {
    enter: (dir: number) => ({ x: dir > 0 ? 60 : -60, opacity: 0 }),
    center: { x: 0, opacity: 1 },
    exit: (dir: number) => ({ x: dir > 0 ? -60 : 60, opacity: 0 }),
  };

  // ─── Render ───────────────────────────────────────────────────────
  return (
    <div className="w-full">
      {/* ── Progress Bar ─────────────────────────────────────────── */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-3">
          {STEPS.map((s, i) => {
            const Icon = s.icon;
            const isActive = step === s.id;
            const isDone = step > s.id;
            return (
              <React.Fragment key={s.id}>
                <div className="flex flex-col items-center flex-shrink-0">
                  <div
                    className={`w-10 h-10 rounded-xl flex items-center justify-center transition-all duration-300 ${
                      isDone
                        ? 'bg-green-500 text-white shadow-md shadow-green-500/25'
                        : isActive
                        ? 'bg-indigo-600 text-white shadow-md shadow-indigo-500/25'
                        : 'bg-white/[0.08] text-gray-500'
                    }`}
                  >
                    {isDone ? <CheckCircle2 className="w-5 h-5" /> : <Icon className="w-5 h-5" />}
                  </div>
                  <span className={`text-xs mt-1.5 font-medium hidden sm:block ${
                    isActive ? 'text-indigo-400' : isDone ? 'text-green-400' : 'text-gray-500'
                  }`}>
                    {s.title}
                  </span>
                </div>
                {i < STEPS.length - 1 && (
                  <div className="flex-1 mx-3 h-0.5 rounded-full bg-white/10 overflow-hidden">
                    <motion.div
                      className="h-full bg-gradient-to-r from-indigo-500 to-indigo-600 rounded-full"
                      initial={false}
                      animate={{ width: isDone ? '100%' : '0%' }}
                      transition={{ duration: 0.4 }}
                    />
                  </div>
                )}
              </React.Fragment>
            );
          })}
        </div>
        <p className="text-center text-sm text-gray-400">
          Step {step} of 3 — {STEPS[step - 1].subtitle}
        </p>
      </div>

      {/* ── Error Banner ─────────────────────────────────────────── */}
      <AnimatePresence>
        {error && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="mb-6 overflow-hidden"
          >
            <div className="flex items-center gap-3 bg-red-500/10 border border-red-500/20 text-red-400 px-4 py-3 rounded-xl text-sm">
              <div className="w-5 h-5 rounded-full bg-red-500/20 flex items-center justify-center flex-shrink-0">
                <X className="w-3 h-3" />
              </div>
              {error}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── Step Content ─────────────────────────────────────────── */}
      <div className="min-h-[420px]">
        <AnimatePresence mode="wait" custom={direction}>
          {/* ── STEP 1: Business Basics ──────────────────────────── */}
          {step === 1 && (
            <motion.div
              key="step1"
              custom={direction}
              variants={slideVariants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{ duration: 0.3, ease: 'easeInOut' }}
              className="space-y-5"
            >
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1.5">
                  Business Name <span className="text-red-400">*</span>
                </label>
                <input
                  type="text"
                  name="businessName"
                  value={formData.businessName}
                  onChange={handleInputChange}
                  placeholder="e.g., Sunrise Plumbing Co."
                  className="w-full px-4 py-3 border border-white/10 rounded-xl focus:ring-2 focus:ring-indigo-500/30 focus:border-indigo-500/50 transition-all bg-white/[0.06] text-white placeholder-gray-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1.5">
                  Email <span className="text-red-400">*</span>
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  placeholder="you@company.com"
                  className="w-full px-4 py-3 border border-white/10 rounded-xl focus:ring-2 focus:ring-indigo-500/30 focus:border-indigo-500/50 transition-all bg-white/[0.06] text-white placeholder-gray-500"
                />
                <p className="text-xs text-gray-500 mt-1.5">We&apos;ll send your login credentials here</p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1.5">
                  Tagline <span className="text-gray-500 font-normal">(optional)</span>
                </label>
                <input
                  type="text"
                  name="tagline"
                  value={formData.tagline}
                  onChange={handleInputChange}
                  placeholder="e.g., Quality plumbing solutions since 1995"
                  className="w-full px-4 py-3 border border-white/10 rounded-xl focus:ring-2 focus:ring-indigo-500/30 focus:border-indigo-500/50 transition-all bg-white/[0.06] text-white placeholder-gray-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1.5">Industry</label>
                <select
                  value={formData.industry}
                  onChange={(e) => setFormData((p) => ({ ...p, industry: e.target.value }))}
                  className="w-full px-4 py-3 border border-white/10 rounded-xl text-sm bg-white/[0.06] text-white placeholder-gray-500 focus:ring-2 focus:ring-indigo-500/30 focus:border-indigo-500/50 outline-none appearance-none cursor-pointer transition-all hover:bg-white/[0.08]"
                  style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='16' height='16' viewBox='0 0 24 24' fill='none' stroke='%239ca3af' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpath d='m6 9 6 6 6-6'/%3E%3C/svg%3E")`, backgroundRepeat: 'no-repeat', backgroundPosition: 'right 12px center' }}
                >
                  <option value="" disabled className="bg-[#1a1a2e] text-gray-400">Select your industry...</option>
                  {INDUSTRIES.map((ind) => (
                    <option key={ind} value={ind.toLowerCase()} className="bg-[#1a1a2e] text-white">
                      {ind}
                    </option>
                  ))}
                </select>
              </div>
            </motion.div>
          )}

          {/* ── STEP 2: Details ──────────────────────────────────── */}
          {step === 2 && (
            <motion.div
              key="step2"
              custom={direction}
              variants={slideVariants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{ duration: 0.3, ease: 'easeInOut' }}
              className="space-y-5"
            >
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1.5">
                  About Your Business <span className="text-red-400">*</span>
                </label>
                <textarea
                  name="about"
                  value={formData.about}
                  onChange={handleInputChange}
                  placeholder="Tell us your story — what makes your business special, your mission, experience, etc."
                  rows={4}
                  className="w-full px-4 py-3 border border-white/10 rounded-xl focus:ring-2 focus:ring-indigo-500/30 focus:border-indigo-500/50 transition-all bg-white/[0.06] text-white placeholder-gray-500 resize-none"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1.5">
                  Services You Offer <span className="text-red-400">*</span>
                </label>
                <textarea
                  value={services}
                  onChange={(e) => setServices(e.target.value)}
                  placeholder="e.g., Emergency repairs, Water heater installation, Drain cleaning"
                  rows={3}
                  className="w-full px-4 py-3 border border-white/10 rounded-xl focus:ring-2 focus:ring-indigo-500/30 focus:border-indigo-500/50 transition-all bg-white/[0.06] text-white placeholder-gray-500 resize-none"
                />
                <p className="text-xs text-gray-500 mt-1.5">Separate services with commas</p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1.5">
                    Phone <span className="text-gray-500 font-normal">(optional)</span>
                  </label>
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                    placeholder="+1 (555) 000-0000"
                    className="w-full px-4 py-3 border border-white/10 rounded-xl focus:ring-2 focus:ring-indigo-500/30 focus:border-indigo-500/50 transition-all bg-white/[0.06] text-white placeholder-gray-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1.5">
                    Address <span className="text-gray-500 font-normal">(optional)</span>
                  </label>
                  <input
                    type="text"
                    name="address"
                    value={formData.address}
                    onChange={handleInputChange}
                    placeholder="Business address"
                    className="w-full px-4 py-3 border border-white/10 rounded-xl focus:ring-2 focus:ring-indigo-500/30 focus:border-indigo-500/50 transition-all bg-white/[0.06] text-white placeholder-gray-500"
                  />
                </div>
              </div>
            </motion.div>
          )}

          {/* ── STEP 3: Style & Uploads ──────────────────────────── */}
          {step === 3 && (
            <motion.div
              key="step3"
              custom={direction}
              variants={slideVariants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{ duration: 0.3, ease: 'easeInOut' }}
              className="space-y-6"
            >
              {/* Template Selection */}
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-3">Choose Your Website Style</label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {TEMPLATE_OPTIONS.map((template) => (
                    <button
                      key={template.id}
                      type="button"
                      onClick={() => setSelectedTemplate(template.id)}
                      className={`relative p-4 rounded-xl text-left transition-all duration-200 ${
                        selectedTemplate === template.id
                          ? 'ring-2 ring-indigo-500 shadow-lg shadow-indigo-500/10'
                          : 'border border-white/10 hover:border-indigo-400/40'
                      } ${template.id === 'dark' ? 'bg-gray-900' : 'bg-white/[0.08]'}`}
                    >
                      {selectedTemplate === template.id && (
                        <div className="absolute -top-1.5 -right-1.5 w-5 h-5 bg-indigo-500 rounded-full flex items-center justify-center shadow">
                          <CheckCircle2 className="w-3 h-3 text-white" />
                        </div>
                      )}
                      <div className="flex items-center gap-2.5 mb-2">
                        <div className="flex gap-1">
                          {template.colors.map((c, i) => (
                            <div key={i} className="w-4 h-4 rounded-full border border-white/20" style={{ backgroundColor: c }} />
                          ))}
                        </div>
                        <h4 className={`font-semibold text-sm ${template.id === 'dark' ? 'text-white' : 'text-gray-200'}`}>
                          {template.name}
                        </h4>
                      </div>
                      <p className={`text-xs ${template.id === 'dark' ? 'text-gray-400' : 'text-gray-400'}`}>
                        {template.description}
                      </p>
                    </button>
                  ))}
                </div>
              </div>

              {/* File Uploads */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <DropZone
                  id="logo"
                  label="Logo"
                  hint="PNG, JPG, SVG — max 5MB"
                  accept="image/*"
                  files={logoFiles}
                  onFiles={setLogoFiles}
                />
                <DropZone
                  id="heroImage"
                  label="Hero Image"
                  hint="PNG, JPG, WebP — max 10MB"
                  accept="image/*"
                  files={heroFiles}
                  onFiles={setHeroFiles}
                />
              </div>

              <DropZone
                id="additionalImages"
                label="Gallery Images (optional)"
                hint="Up to 10 images — max 5MB each"
                accept="image/*"
                multiple
                files={galleryFiles}
                onFiles={setGalleryFiles}
                onRemove={(i) => setGalleryFiles((f) => f.filter((_, idx) => idx !== i))}
              />

              {/* Color Presets */}
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Brand Colors</label>
                <div className="grid grid-cols-3 sm:grid-cols-6 gap-2">
                  {COLOR_PRESETS.map((preset) => (
                    <button
                      key={preset.name}
                      type="button"
                      onClick={() => setBrandColors({ primary: preset.primary, secondary: preset.secondary, accent: preset.accent })}
                      className={`p-2.5 rounded-lg transition-all text-center ${
                        brandColors.primary === preset.primary
                          ? 'ring-2 ring-indigo-500 bg-indigo-500/10'
                          : 'bg-white/[0.06] hover:bg-white/[0.1] border border-white/10'
                      }`}
                    >
                      <div className="flex justify-center gap-1 mb-1.5">
                        <div className="w-4 h-4 rounded-full" style={{ backgroundColor: preset.primary }} />
                        <div className="w-4 h-4 rounded-full" style={{ backgroundColor: preset.secondary }} />
                        <div className="w-4 h-4 rounded-full" style={{ backgroundColor: preset.accent }} />
                      </div>
                      <span className="text-[10px] font-medium text-gray-400">{preset.name}</span>
                    </button>
                  ))}
                </div>
                <p className="text-xs text-gray-500 mt-2">Or we&apos;ll extract colors from your logo automatically</p>

                {/* Custom color toggle */}
                <button
                  type="button"
                  onClick={() => setShowCustomColors(!showCustomColors)}
                  className="mt-3 text-sm text-indigo-600 hover:text-indigo-700 font-medium flex items-center gap-1"
                >
                  <Palette className="w-3.5 h-3.5" />
                  {showCustomColors ? 'Hide custom colors' : 'Pick my own colors'}
                </button>

                <AnimatePresence>
                  {showCustomColors && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.2 }}
                      className="overflow-hidden"
                    >
                      <div className="mt-3 space-y-3">
                        {[
                          { label: 'Primary', key: 'primary' as const, hint: 'Buttons, links, main accents' },
                          { label: 'Secondary', key: 'secondary' as const, hint: 'Gradients, backgrounds' },
                          { label: 'Accent', key: 'accent' as const, hint: 'Highlights, decorative' },
                        ].map((c) => (
                          <div key={c.key} className="flex items-center gap-3">
                            <input
                              type="color"
                              value={brandColors[c.key]}
                              onChange={(e) => setBrandColors((prev) => ({ ...prev, [c.key]: e.target.value }))}
                              className="w-10 h-10 rounded-lg cursor-pointer border-0 bg-transparent"
                            />
                            <div className="flex-1">
                              <div className="flex items-center gap-2">
                                <span className="text-sm font-medium text-gray-300">{c.label}</span>
                                <input
                                  type="text"
                                  value={brandColors[c.key]}
                                  onChange={(e) => setBrandColors((prev) => ({ ...prev, [c.key]: e.target.value }))}
                                  className="w-20 px-2 py-1 text-xs font-mono border border-white/10 rounded-md bg-white/[0.06] text-gray-300"
                                />
                              </div>
                              <p className="text-[10px] text-gray-400">{c.hint}</p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* Testimonials — Collapsible */}
              <div className="border border-white/10 rounded-xl overflow-hidden">
                <button
                  type="button"
                  onClick={() => setShowTestimonials(!showTestimonials)}
                  className="w-full flex items-center justify-between p-4 text-left hover:bg-white/[0.04] transition-colors"
                >
                  <div className="flex items-center gap-2">
                    <Star className="w-4 h-4 text-gray-400" />
                    <span className="text-sm font-medium text-gray-700">
                      Customer Testimonials
                      {testimonials.length > 0 && (
                        <span className="ml-2 px-1.5 py-0.5 bg-indigo-100 text-indigo-700 rounded text-xs">
                          {testimonials.length}
                        </span>
                      )}
                    </span>
                    <span className="text-xs text-gray-500">optional</span>
                  </div>
                  {showTestimonials ? <ChevronUp className="w-4 h-4 text-gray-400" /> : <ChevronDown className="w-4 h-4 text-gray-400" />}
                </button>

                <AnimatePresence>
                  {showTestimonials && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.2 }}
                      className="overflow-hidden"
                    >
                      <div className="p-4 pt-0 space-y-3">
                        {testimonials.map((t, i) => (
                          <div key={i} className="flex items-start gap-3 bg-white/[0.04] rounded-lg p-3">
                            <div className="flex-1 min-w-0">
                              <p className="text-sm text-gray-300 italic">&ldquo;{t.quote}&rdquo;</p>
                              <p className="text-xs text-gray-500 mt-1">— {t.authorName}{t.authorRole ? `, ${t.authorRole}` : ''}</p>
                            </div>
                            <button
                              type="button"
                              onClick={() => setTestimonials((ts) => ts.filter((_, idx) => idx !== i))}
                              className="p-1 hover:bg-red-50 rounded text-gray-400 hover:text-red-500"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        ))}

                        <div className="space-y-2">
                          <div className="grid grid-cols-2 gap-2">
                            <input
                              type="text"
                              value={newTestimonial.authorName}
                              onChange={(e) => setNewTestimonial({ ...newTestimonial, authorName: e.target.value })}
                              placeholder="Name"
                              className="px-3 py-2 border border-white/10 rounded-lg text-sm bg-white/[0.06] text-white placeholder-gray-500 outline-none focus:ring-2 focus:ring-indigo-500/30 focus:border-indigo-500/50 transition-all"
                            />
                            <input
                              type="text"
                              value={newTestimonial.authorRole}
                              onChange={(e) => setNewTestimonial({ ...newTestimonial, authorRole: e.target.value })}
                              placeholder="Role (optional)"
                              className="px-3 py-2 border border-white/10 rounded-lg text-sm bg-white/[0.06] text-white placeholder-gray-500 outline-none focus:ring-2 focus:ring-indigo-500/30 focus:border-indigo-500/50 transition-all"
                            />
                          </div>
                          <textarea
                            value={newTestimonial.quote}
                            onChange={(e) => setNewTestimonial({ ...newTestimonial, quote: e.target.value })}
                            placeholder="What they said about your business..."
                            rows={2}
                            className="w-full px-3 py-2 border border-white/10 rounded-lg text-sm resize-none bg-white/[0.06] text-white placeholder-gray-500 outline-none focus:ring-2 focus:ring-indigo-500/30 focus:border-indigo-500/50 transition-all"
                          />
                          <button
                            type="button"
                            onClick={handleAddTestimonial}
                            disabled={!newTestimonial.quote.trim() || !newTestimonial.authorName.trim()}
                            className="flex items-center gap-1.5 px-3 py-1.5 bg-white/[0.08] hover:bg-white/[0.12] text-gray-300 text-sm font-medium rounded-lg transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
                          >
                            <Plus className="w-3.5 h-3.5" />
                            Add
                          </button>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* ── Navigation ───────────────────────────────────────────── */}
      <div className="flex items-center justify-between mt-8 pt-6 border-t border-white/[0.06]">
        {step > 1 ? (
          <button
            type="button"
            onClick={goBack}
            className="flex items-center gap-2 px-5 py-2.5 text-gray-400 hover:text-white font-medium rounded-xl hover:bg-white/[0.06] transition-all"
          >
            <ArrowLeft className="w-4 h-4" />
            Back
          </button>
        ) : (
          <div />
        )}

        {step < 3 ? (
          <button
            type="button"
            onClick={goNext}
            className="flex items-center gap-2 px-6 py-3 bg-indigo-600 text-white font-semibold rounded-xl hover:bg-indigo-700 transition-all shadow-md shadow-indigo-500/25 hover:shadow-lg hover:shadow-indigo-500/30 active:scale-[0.98]"
          >
            Continue
            <ArrowRight className="w-4 h-4" />
          </button>
        ) : (
          <button
            type="button"
            onClick={handleSubmit}
            disabled={loading}
            className="flex items-center gap-2 px-8 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-semibold rounded-xl hover:from-indigo-700 hover:to-purple-700 transition-all shadow-lg shadow-indigo-500/25 hover:shadow-xl hover:shadow-indigo-500/35 active:scale-[0.98] disabled:opacity-60 disabled:cursor-not-allowed disabled:active:scale-100"
          >
            {loading ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                Building Your Website...
              </>
            ) : (
              <>
                <Sparkles className="w-5 h-5" />
                Submit
              </>
            )}
          </button>
        )}
      </div>
    </div>
  );
}
