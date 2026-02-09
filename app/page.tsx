'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { 
  Sparkles, 
  Palette, 
  Rocket, 
  Zap, 
  Shield, 
  Globe,
  ArrowRight,
  CheckCircle2,
  Star,
  Clock,
  CreditCard,
  Moon,
  Sun,
} from 'lucide-react';

// Animation variants
const fadeInUp = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 }
};

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1
    }
  }
};

const scaleIn = {
  hidden: { opacity: 0, scale: 0.9 },
  visible: { opacity: 1, scale: 1 }
};

export default function HomePage() {
  return (
    <div className="overflow-hidden">
      {/* Sticky Nav */}
      <nav className="fixed top-0 inset-x-0 z-50 bg-white/80 backdrop-blur-md border-b border-gray-100">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-indigo-500 to-purple-600" />
            <span className="font-bold text-xl text-gray-900">ByteSuite</span>
          </Link>
          <div className="flex items-center gap-3">
            <Link href="/login" className="text-sm font-medium text-gray-600 hover:text-gray-900 transition-colors hidden sm:block">
              Login
            </Link>
            <Link 
              href="/get-started" 
              className="inline-flex items-center gap-1.5 px-4 py-2 bg-indigo-600 text-white text-sm font-semibold rounded-lg hover:bg-indigo-700 transition-colors shadow-sm"
            >
              Get Started
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center pt-16 pb-24">
        {/* Background effects */}
        <div className="absolute inset-0 -z-10">
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl" />
          <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl" />
          <div className="absolute inset-0 bg-[linear-gradient(to_right,#e5e7eb_1px,transparent_1px),linear-gradient(to_bottom,#e5e7eb_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_110%)] opacity-30" />
        </div>

        <div className="max-w-6xl mx-auto px-4 sm:px-6 relative">
          <motion.div 
            className="max-w-4xl mx-auto text-center"
            initial="hidden"
            animate="visible"
            variants={staggerContainer}
          >
            {/* Badge */}
            <motion.div 
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-indigo-50 border border-indigo-200 mb-8"
              variants={fadeInUp}
            >
              <Sparkles className="w-4 h-4 text-indigo-600" />
              <span className="text-sm font-medium text-indigo-700">Professional Website Builder</span>
            </motion.div>

            {/* Main Headline */}
            <motion.h1 
              className="text-5xl md:text-6xl lg:text-7xl font-extrabold tracking-tight mb-6"
              variants={fadeInUp}
            >
              Get a Professional Website
              <span className="block mt-2 bg-gradient-to-r from-indigo-600 via-purple-600 to-cyan-500 bg-clip-text text-transparent">Built in Minutes</span>
            </motion.h1>

            {/* Subheadline */}
            <motion.p 
              className="text-xl md:text-2xl text-gray-600 max-w-2xl mx-auto mb-10"
              variants={fadeInUp}
            >
              Tell us about your business and we&apos;ll create a stunning, 
              ready-to-launch website — completely free.
            </motion.p>

            {/* CTA Buttons */}
            <motion.div 
              className="flex flex-col sm:flex-row gap-4 justify-center items-center"
              variants={fadeInUp}
            >
              <Link 
                href="/get-started" 
                className="inline-flex items-center gap-2 px-8 py-4 bg-indigo-600 text-white font-semibold rounded-xl hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-500/25 hover:shadow-xl hover:shadow-indigo-500/30 active:scale-[0.98]"
              >
                Build My Website — Free
                <ArrowRight className="w-5 h-5" />
              </Link>
              <Link 
                href="/login" 
                className="inline-flex items-center gap-2 px-6 py-4 text-gray-600 font-medium hover:text-gray-900 transition-colors"
              >
                Already have an account? Login
              </Link>
            </motion.div>

            {/* Social proof */}
            <motion.div 
              className="mt-12 flex flex-col sm:flex-row items-center justify-center gap-6 text-sm text-gray-500"
              variants={fadeInUp}
            >
              <div className="flex items-center gap-1">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-4 h-4 fill-amber-400 text-amber-400" />
                ))}
                <span className="ml-2">Trusted by 500+ businesses</span>
              </div>
              <div className="hidden sm:block w-px h-4 bg-gray-300" />
              <div className="flex items-center gap-2">
                <CreditCard className="w-4 h-4 text-green-500" />
                <span>100% free, no credit card</span>
              </div>
            </motion.div>
          </motion.div>

          {/* Hero visual - Website mockup */}
          <motion.div 
            className="mt-20 relative max-w-5xl mx-auto"
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.8 }}
          >
            <div className="relative rounded-2xl overflow-hidden shadow-2xl border border-gray-200 bg-white">
              {/* Browser chrome */}
              <div className="flex items-center gap-2 px-4 py-3 bg-gray-100 border-b border-gray-200">
                <div className="flex gap-1.5">
                  <div className="w-3 h-3 rounded-full bg-red-400" />
                  <div className="w-3 h-3 rounded-full bg-amber-400" />
                  <div className="w-3 h-3 rounded-full bg-green-400" />
                </div>
                <div className="flex-1 mx-4">
                  <div className="bg-white rounded-lg px-4 py-1.5 text-sm text-gray-500 border border-gray-200">
                    yourbusiness.com
                  </div>
                </div>
              </div>
              {/* Website preview mockup */}
              <div className="aspect-[16/9] bg-gradient-to-br from-indigo-600 via-purple-600 to-cyan-500 flex items-center justify-center">
                <div className="text-center text-white p-8">
                  <h3 className="text-3xl font-bold mb-4">Your Website Here</h3>
                  <p className="text-white/80 max-w-md">
                    Professional, responsive, and ready to launch in minutes
                  </p>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 md:py-28 bg-gray-50">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          {/* Section header */}
          <motion.div 
            className="text-center max-w-3xl mx-auto mb-16"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={staggerContainer}
          >
            <motion.span 
              className="inline-flex items-center px-3 py-1 rounded-full bg-indigo-50 text-indigo-700 text-xs font-medium mb-4"
              variants={fadeInUp}
            >
              Features
            </motion.span>
            <motion.h2 
              className="text-4xl md:text-5xl font-bold mb-6"
              variants={fadeInUp}
            >
              Everything You Need to
              <span className="bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent"> Launch Fast</span>
            </motion.h2>
            <motion.p 
              className="text-xl text-gray-600"
              variants={fadeInUp}
            >
              We handle the heavy lifting so you can focus on what matters — your business.
            </motion.p>
          </motion.div>

          {/* Features grid */}
          <motion.div 
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={staggerContainer}
          >
            {features.map((feature) => (
              <motion.div 
                key={feature.title}
                className="bg-white rounded-2xl p-8 border border-gray-100 shadow-sm hover:shadow-md hover:-translate-y-1 transition-all duration-300"
                variants={scaleIn}
              >
                <div className={`w-14 h-14 rounded-2xl ${feature.color} flex items-center justify-center mb-6`}>
                  <feature.icon className="w-7 h-7 text-white" />
                </div>
                <h3 className="text-xl font-bold mb-3">{feature.title}</h3>
                <p className="text-gray-600 leading-relaxed">{feature.description}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* How it Works Section */}
      <section className="py-20 md:py-28">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <motion.div 
            className="text-center max-w-3xl mx-auto mb-16"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={staggerContainer}
          >
            <motion.span className="inline-flex items-center px-3 py-1 rounded-full bg-indigo-50 text-indigo-700 text-xs font-medium mb-4" variants={fadeInUp}>
              How It Works
            </motion.span>
            <motion.h2 className="text-4xl md:text-5xl font-bold mb-6" variants={fadeInUp}>
              Three Steps to Your
              <span className="bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent"> Dream Website</span>
            </motion.h2>
          </motion.div>

          <motion.div 
            className="grid grid-cols-1 md:grid-cols-3 gap-8 relative"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={staggerContainer}
          >
            {/* Connecting line */}
            <div className="hidden md:block absolute top-8 left-[20%] right-[20%] h-0.5 bg-gradient-to-r from-indigo-500 via-purple-500 to-cyan-500" />

            {steps.map((step, index) => (
              <motion.div 
                key={step.title}
                className="relative text-center"
                variants={fadeInUp}
              >
                <div className="relative inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 text-white text-xl font-bold mb-6 shadow-lg shadow-indigo-500/25 z-10">
                  {index + 1}
                </div>
                <h3 className="text-xl font-bold mb-3">{step.title}</h3>
                <p className="text-gray-600">{step.description}</p>
              </motion.div>
            ))}
          </motion.div>

          {/* CTA */}
          <motion.div 
            className="text-center mt-16"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <Link href="/get-started" className="inline-flex items-center gap-2 px-8 py-4 bg-indigo-600 text-white font-semibold rounded-xl hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-500/25">
              Get Started Now
              <ArrowRight className="w-5 h-5" />
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Templates Preview Section */}
      <section className="py-20 md:py-28 bg-gray-900 text-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <motion.div 
            className="text-center max-w-3xl mx-auto mb-16"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={staggerContainer}
          >
            <motion.span 
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 border border-white/20 text-sm font-medium mb-4"
              variants={fadeInUp}
            >
              <Sparkles className="w-4 h-4" />
              Templates
            </motion.span>
            <motion.h2 className="text-4xl md:text-5xl font-bold mb-6" variants={fadeInUp}>
              Professional Templates for Every Business
            </motion.h2>
            <motion.p className="text-xl text-gray-400" variants={fadeInUp}>
              Choose your style, add your brand, and launch in minutes.
            </motion.p>
          </motion.div>

          {/* Template cards */}
          <motion.div 
            className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-3xl mx-auto"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={staggerContainer}
          >
            {templates.map((template) => (
              <motion.div 
                key={template.name}
                className="group relative rounded-2xl overflow-hidden bg-white/5 border border-white/10 hover:border-white/30 transition-all duration-300"
                variants={scaleIn}
              >
                <div className={`aspect-[4/3] ${template.bg} p-6 flex flex-col justify-between`}>
                  <div className="flex items-center gap-2">
                    <template.icon className={`w-5 h-5 ${template.iconColor}`} />
                    <span className={`text-sm font-medium ${template.iconColor}`}>{template.label}</span>
                  </div>
                  <div className={template.textColor}>
                    <h4 className="text-lg font-bold">{template.name}</h4>
                    <p className={`text-sm ${template.subColor}`}>{template.description}</p>
                  </div>
                </div>
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                  <Link 
                    href={`/get-started?template=${template.id}`}
                    className="inline-flex items-center gap-2 px-5 py-2.5 bg-white text-gray-900 font-semibold rounded-lg text-sm"
                  >
                    Use Template
                  </Link>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Final CTA Section */}
      <section className="py-20 md:py-28">
        <div className="max-w-4xl mx-auto px-4 sm:px-6">
          <motion.div 
            className="relative rounded-3xl bg-gradient-to-br from-indigo-600 via-purple-600 to-cyan-600 p-12 md:p-16 text-center text-white overflow-hidden"
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            {/* Background decoration */}
            <div className="absolute -top-24 -right-24 w-64 h-64 bg-white/10 rounded-full blur-3xl" />
            <div className="absolute -bottom-24 -left-24 w-64 h-64 bg-white/10 rounded-full blur-3xl" />
            
            <div className="relative">
              <h2 className="text-3xl md:text-5xl font-bold mb-6">
                Ready to Build Your Website?
              </h2>
              <p className="text-xl text-white/90 max-w-2xl mx-auto mb-10">
                Join hundreds of businesses who&apos;ve launched professional websites with ByteSuite. 
                Start for free — no credit card required.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link 
                  href="/get-started" 
                  className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-white text-indigo-600 hover:bg-gray-100 rounded-xl font-semibold transition-all shadow-lg"
                >
                  Start Building Free
                  <ArrowRight className="w-5 h-5" />
                </Link>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 border-t border-gray-200">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <div className="flex flex-col md:flex-row justify-between items-center gap-6">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-indigo-500 to-purple-600" />
              <span className="font-bold text-xl">ByteSuite</span>
            </div>
            <div className="flex items-center gap-8 text-sm text-gray-500">
              <Link href="/" className="hover:text-gray-900 transition">Home</Link>
              <Link href="/get-started" className="hover:text-gray-900 transition">Get Started</Link>
              <Link href="/login" className="hover:text-gray-900 transition">Login</Link>
            </div>
            <p className="text-sm text-gray-500">
              &copy; {new Date().getFullYear()} ByteSuite. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}

// Data
const features = [
  {
    icon: Sparkles,
    title: 'Smart Content Generation',
    description: 'We write compelling copy for your website, optimized for engagement and conversions.',
    color: 'bg-indigo-500',
  },
  {
    icon: Palette,
    title: 'Brand Color Extraction',
    description: 'Upload your logo and we\'ll extract the perfect color palette for your brand.',
    color: 'bg-purple-500',
  },
  {
    icon: Zap,
    title: 'Ready in 2 Minutes',
    description: 'Get a fully functional website in minutes, not hours. Ready to customize and deploy.',
    color: 'bg-cyan-500',
  },
  {
    icon: Globe,
    title: 'One-Click Deploy',
    description: 'Deploy to a live URL instantly. No server setup, no technical knowledge required.',
    color: 'bg-green-500',
  },
  {
    icon: Shield,
    title: 'Mobile Responsive',
    description: 'Every website looks perfect on all devices — desktop, tablet, and mobile.',
    color: 'bg-amber-500',
  },
  {
    icon: Rocket,
    title: 'SEO Optimized',
    description: 'Built-in SEO best practices to help your business get found online.',
    color: 'bg-rose-500',
  },
];

const steps = [
  {
    title: 'Fill Out the Form',
    description: 'Enter your business details — name, services, and upload your logo and images.',
  },
  {
    title: 'We Build Your Site',
    description: 'We generate professional content and design your website automatically.',
  },
  {
    title: 'Preview & Launch',
    description: 'Login with your emailed credentials, preview your site, and publish it live.',
  },
];

const templates = [
  {
    id: 'dark',
    name: 'Midnight Pro',
    label: 'Dark Theme',
    description: 'Sleek dark design with neon accents and smooth animations',
    bg: 'bg-gradient-to-br from-gray-900 to-gray-800',
    textColor: 'text-white',
    subColor: 'text-gray-400',
    icon: Moon,
    iconColor: 'text-indigo-400',
  },
  {
    id: 'light',
    name: 'Aurora Light',
    label: 'Light Theme',
    description: 'Clean light theme with vibrant gradients and modern effects',
    bg: 'bg-gradient-to-br from-white to-gray-100',
    textColor: 'text-gray-900',
    subColor: 'text-gray-500',
    icon: Sun,
    iconColor: 'text-amber-500',
  },
];
