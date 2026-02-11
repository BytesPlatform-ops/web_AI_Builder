'use client';

import { BusinessForm } from '@/components/forms/business-form';
import { Shield, Clock, Zap, Palette, Globe, Smartphone } from 'lucide-react';

export default function GetStartedPage() {
  return (
    <div className="min-h-screen relative overflow-hidden bg-[#0f0f1a]">
      {/* Animated gradient mesh background */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-[-20%] left-[-10%] w-[600px] h-[600px] rounded-full bg-indigo-600/20 blur-[120px] animate-pulse" />
        <div className="absolute top-[30%] right-[-15%] w-[500px] h-[500px] rounded-full bg-purple-600/15 blur-[100px] animate-pulse" style={{ animationDelay: '1s' }} />
        <div className="absolute bottom-[-10%] left-[20%] w-[400px] h-[400px] rounded-full bg-blue-600/15 blur-[100px] animate-pulse" style={{ animationDelay: '2s' }} />
        {/* Grid overlay */}
        <div className="absolute inset-0" style={{
          backgroundImage: 'linear-gradient(rgba(255,255,255,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.03) 1px, transparent 1px)',
          backgroundSize: '60px 60px'
        }} />
      </div>

      {/* Trust Bar */}
      <div className="relative z-10 border-b border-white/5 bg-white/[0.03] backdrop-blur-md">
        <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-center gap-6 sm:gap-10 text-sm text-gray-400">
          <span className="flex items-center gap-1.5">
            <Clock className="w-4 h-4 text-indigo-400" />
            Ready in 2 min
          </span>
          <span className="flex items-center gap-1.5">
            <Shield className="w-4 h-4 text-blue-400" />
            Secure
          </span>
        </div>
      </div>

      <div className="relative z-10 max-w-6xl mx-auto px-4 py-10 lg:py-16">
        <div className="flex flex-col lg:flex-row gap-10 lg:gap-16 items-start">
          
          {/* Left side — Info panel (desktop only) */}
          <div className="hidden lg:flex flex-col flex-shrink-0 w-[340px] sticky top-10">
            <div className="mb-8">
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-300 text-xs font-semibold mb-5 tracking-wide uppercase">
                <Zap className="w-3 h-3" />
                Website Builder
              </div>
              <h1 className="text-4xl font-bold text-white tracking-tight mb-4 leading-tight">
                Build Your<br />
                <span className="bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
                  Professional Website
                </span>
              </h1>
              <p className="text-gray-400 leading-relaxed">
                Fill in a few details and get a stunning, ready-to-launch website crafted for your business.
              </p>
            </div>

            {/* Feature cards */}
            <div className="space-y-3">
              {[
                { icon: Palette, title: 'Custom Design', desc: 'Tailored to your brand colors and style', color: 'from-indigo-500 to-blue-500' },
                { icon: Smartphone, title: 'Mobile Responsive', desc: 'Looks great on every device', color: 'from-purple-500 to-pink-500' },
                { icon: Globe, title: 'Instant Publishing', desc: 'Go live with one click', color: 'from-emerald-500 to-teal-500' },
              ].map((feature) => (
                <div
                  key={feature.title}
                  className="group flex items-start gap-4 p-4 rounded-2xl bg-white/[0.03] border border-white/[0.06] hover:bg-white/[0.06] hover:border-white/[0.1] transition-all duration-300"
                >
                  <div className={`flex-shrink-0 w-10 h-10 rounded-xl bg-gradient-to-br ${feature.color} flex items-center justify-center shadow-lg`}>
                    <feature.icon className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <h3 className="text-sm font-semibold text-white mb-0.5">{feature.title}</h3>
                    <p className="text-xs text-gray-500">{feature.desc}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* Decorative visual */}
            <div className="mt-8 p-5 rounded-2xl bg-gradient-to-br from-indigo-600/10 to-purple-600/10 border border-indigo-500/10">
              <div className="flex items-center gap-2 mb-3">
                <div className="w-3 h-3 rounded-full bg-red-400/80" />
                <div className="w-3 h-3 rounded-full bg-yellow-400/80" />
                <div className="w-3 h-3 rounded-full bg-green-400/80" />
              </div>
              <div className="space-y-2">
                <div className="h-2 w-3/4 rounded-full bg-white/10" />
                <div className="h-2 w-1/2 rounded-full bg-white/[0.07]" />
                <div className="h-8 w-full rounded-lg bg-white/[0.05] mt-3" />
                <div className="grid grid-cols-3 gap-2 mt-2">
                  <div className="h-12 rounded-lg bg-indigo-500/15" />
                  <div className="h-12 rounded-lg bg-purple-500/15" />
                  <div className="h-12 rounded-lg bg-blue-500/15" />
                </div>
              </div>
              <p className="text-[10px] text-gray-500 mt-3 text-center">Preview of your future website</p>
            </div>
          </div>

          {/* Right side — Form */}
          <div className="flex-1 w-full max-w-2xl mx-auto lg:mx-0">
            {/* Mobile header */}
            <div className="text-center mb-8 lg:hidden">
              <h1 className="text-3xl sm:text-4xl font-bold text-white tracking-tight mb-3">
                Build Your{' '}
                <span className="bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
                  Professional Website
                </span>
              </h1>
              <p className="text-gray-400 max-w-lg mx-auto">
                Fill in a few details and get a stunning, ready-to-launch website for your business.
              </p>
            </div>

            {/* Glassmorphism Form Card */}
            <div className="relative">
              {/* Glow behind card */}
              <div className="absolute -inset-1 bg-gradient-to-r from-indigo-500/20 via-purple-500/20 to-pink-500/20 rounded-3xl blur-xl opacity-60" />
              
              <div className="relative bg-white/[0.06] backdrop-blur-xl rounded-2xl border border-white/[0.1] shadow-2xl shadow-black/20 p-6 sm:p-8">
                <BusinessForm />
              </div>
            </div>

            {/* Bottom reassurance */}
          </div>
        </div>
      </div>
    </div>
  );
}
