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
  Play,
  Star
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
      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center pt-20 pb-32">
        {/* Background effects */}
        <div className="absolute inset-0 -z-10">
          {/* Gradient orbs */}
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary-500/20 rounded-full blur-3xl animate-pulse" />
          <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-secondary-500/20 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-accent-500/10 rounded-full blur-3xl" />
          
          {/* Grid pattern */}
          <div className="absolute inset-0 bg-[linear-gradient(to_right,#e5e7eb_1px,transparent_1px),linear-gradient(to_bottom,#e5e7eb_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_110%)] opacity-40" />
        </div>

        <div className="container-lg relative">
          <motion.div 
            className="max-w-4xl mx-auto text-center"
            initial="hidden"
            animate="visible"
            variants={staggerContainer}
          >
            {/* Badge */}
            <motion.div 
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary-50 border border-primary-200 mb-8"
              variants={fadeInUp}
            >
              <Sparkles className="w-4 h-4 text-primary-600" />
              <span className="text-sm font-medium text-primary-700">AI-Powered Website Generation</span>
            </motion.div>

            {/* Main Headline */}
            <motion.h1 
              className="text-5xl md:text-6xl lg:text-7xl font-extrabold tracking-tight mb-6"
              variants={fadeInUp}
            >
              Build Stunning Websites
              <span className="block mt-2 text-gradient">In Seconds, Not Days</span>
            </motion.h1>

            {/* Subheadline */}
            <motion.p 
              className="text-xl md:text-2xl text-gray-600 max-w-2xl mx-auto mb-10"
              variants={fadeInUp}
            >
              Transform your business idea into a professional website with AI. 
              Just describe your business and watch the magic happen.
            </motion.p>

            {/* CTA Buttons */}
            <motion.div 
              className="flex flex-col sm:flex-row gap-4 justify-center items-center"
              variants={fadeInUp}
            >
              <Link 
                href="/get-started" 
                className="btn-primary btn-lg group"
              >
                Start Building Free
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Link>
              <button className="btn-outline btn-lg group">
                <Play className="w-5 h-5" />
                Watch Demo
              </button>
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
                <span className="ml-2">4.9/5 from 2,000+ users</span>
              </div>
              <div className="hidden sm:block w-px h-4 bg-gray-300" />
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-green-500" />
                <span>No credit card required</span>
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
              <div className="aspect-[16/9] bg-gradient-to-br from-primary-500 via-secondary-500 to-accent-500 flex items-center justify-center">
                <div className="text-center text-white p-8">
                  <h3 className="text-3xl font-bold mb-4">Your Website Here</h3>
                  <p className="text-white/80 max-w-md">
                    Professional, responsive, and ready to launch in minutes
                  </p>
                </div>
              </div>
            </div>
            
            {/* Floating elements */}
            <div className="absolute -top-6 -right-6 w-24 h-24 bg-accent-500 rounded-2xl shadow-lg flex items-center justify-center animate-float">
              <Zap className="w-10 h-10 text-white" />
            </div>
            <div className="absolute -bottom-6 -left-6 w-20 h-20 bg-primary-500 rounded-2xl shadow-lg flex items-center justify-center animate-float" style={{ animationDelay: '0.5s' }}>
              <Palette className="w-8 h-8 text-white" />
            </div>
          </motion.div>
        </div>
      </section>

      {/* Features Section */}
      <section className="section bg-gray-50">
        <div className="container-lg">
          {/* Section header */}
          <motion.div 
            className="text-center max-w-3xl mx-auto mb-16"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={staggerContainer}
          >
            <motion.span 
              className="badge-primary mb-4 inline-block"
              variants={fadeInUp}
            >
              Features
            </motion.span>
            <motion.h2 
              className="text-4xl md:text-5xl font-bold mb-6"
              variants={fadeInUp}
            >
              Everything You Need to
              <span className="text-gradient"> Build Fast</span>
            </motion.h2>
            <motion.p 
              className="text-xl text-gray-600"
              variants={fadeInUp}
            >
              Our AI handles the heavy lifting so you can focus on what matters - your business.
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
                className="card-hover p-8"
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
      <section className="section">
        <div className="container-lg">
          <motion.div 
            className="text-center max-w-3xl mx-auto mb-16"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={staggerContainer}
          >
            <motion.span className="badge-primary mb-4 inline-block" variants={fadeInUp}>
              How It Works
            </motion.span>
            <motion.h2 className="text-4xl md:text-5xl font-bold mb-6" variants={fadeInUp}>
              Three Steps to Your
              <span className="text-gradient"> Dream Website</span>
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
            <div className="hidden md:block absolute top-8 left-[20%] right-[20%] h-0.5 bg-gradient-to-r from-primary-500 via-secondary-500 to-accent-500" />

            {steps.map((step, index) => (
              <motion.div 
                key={step.title}
                className="relative text-center"
                variants={fadeInUp}
              >
                {/* Step number */}
                <div className="relative inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-br from-primary-500 to-secondary-500 text-white text-xl font-bold mb-6 shadow-glow z-10">
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
            <Link href="/get-started" className="btn-primary btn-lg inline-flex items-center gap-2">
              Get Started Now
              <ArrowRight className="w-5 h-5" />
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Templates Preview Section */}
      <section className="section bg-gray-900 text-white">
        <div className="container-lg">
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
              Start with a beautiful template, customize with your brand, and launch in minutes.
            </motion.p>
          </motion.div>

          {/* Template cards */}
          <motion.div 
            className="grid grid-cols-1 md:grid-cols-3 gap-6"
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
                <div className={`aspect-[4/3] bg-gradient-to-br ${template.gradient} p-6 flex items-end`}>
                  <div className="text-white">
                    <h4 className="text-lg font-bold">{template.name}</h4>
                    <p className="text-sm text-white/80">{template.description}</p>
                  </div>
                </div>
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                  <Link 
                    href={`/get-started?template=${template.id}`}
                    className="btn-primary"
                  >
                    Use Template
                  </Link>
                </div>
              </motion.div>
            ))}
          </motion.div>

          <motion.div 
            className="text-center mt-12"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
          >
            <Link href="/get-started" className="inline-flex items-center gap-2 px-6 py-3 rounded-xl border border-white/30 text-white hover:bg-white hover:text-gray-900 transition-all font-medium">
              View All Templates
              <ArrowRight className="w-4 h-4" />
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Final CTA Section */}
      <section className="section">
        <div className="container-md">
          <motion.div 
            className="relative rounded-3xl bg-gradient-to-br from-primary-600 via-secondary-600 to-accent-600 p-12 md:p-16 text-center text-white overflow-hidden"
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
                Join thousands of businesses who've created stunning websites with our AI-powered builder. 
                Start for free, no credit card required.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link 
                  href="/get-started" 
                  className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-white text-primary-600 hover:bg-gray-100 rounded-xl font-semibold transition-all"
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
        <div className="container-lg">
          <div className="flex flex-col md:flex-row justify-between items-center gap-6">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary-500 to-secondary-500" />
              <span className="font-bold text-xl">Website Builder</span>
            </div>
            <div className="flex items-center gap-8 text-sm text-gray-500">
              <Link href="/" className="hover:text-gray-900 transition">Home</Link>
              <Link href="/get-started" className="hover:text-gray-900 transition">Generate</Link>
            </div>
            <p className="text-sm text-gray-500">
              © 2024 Website Builder. All rights reserved.
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
    title: 'AI Content Generation',
    description: 'Our AI writes compelling copy for your website, optimized for engagement and conversions.',
    color: 'bg-primary-500',
  },
  {
    icon: Palette,
    title: 'Smart Color Extraction',
    description: 'Upload your logo and watch as we extract the perfect color palette for your brand.',
    color: 'bg-secondary-500',
  },
  {
    icon: Zap,
    title: 'Instant Generation',
    description: 'Get a fully functional website in seconds, not hours. Ready to customize and deploy.',
    color: 'bg-accent-500',
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
    description: 'Every website looks perfect on all devices - desktop, tablet, and mobile.',
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
    title: 'Choose a Template',
    description: 'Pick from our collection of professionally designed templates built for your industry.',
  },
  {
    title: 'Add Your Content',
    description: 'Enter your business details and let our AI enhance your content automatically.',
  },
  {
    title: 'Launch Your Site',
    description: 'Preview, customize, and deploy your website with a single click.',
  },
];

const templates = [
  {
    id: 'modern-business',
    name: 'Modern Business',
    description: 'Professional & clean',
    gradient: 'from-blue-600 to-indigo-600',
  },
  {
    id: 'startup-bold',
    name: 'Startup Bold',
    description: 'Dynamic & vibrant',
    gradient: 'from-purple-600 to-pink-600',
  },
  {
    id: 'minimal-portfolio',
    name: 'Minimal Portfolio',
    description: 'Elegant & simple',
    gradient: 'from-gray-700 to-gray-900',
  },
];
