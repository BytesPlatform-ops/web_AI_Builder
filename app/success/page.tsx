'use client';

import { useSearchParams } from 'next/navigation';
import { Suspense, useEffect } from 'react';
import { motion } from 'framer-motion';
import { CheckCircle2, Sparkles, ArrowRight, Copy } from 'lucide-react';
import Link from 'next/link';
import { useState } from 'react';

// Declare fbq for TypeScript
declare global {
  interface Window {
    fbq?: (...args: unknown[]) => void;
  }
}

function SuccessContent() {
  const searchParams = useSearchParams();
  const submissionId = searchParams.get('id');
  const [copied, setCopied] = useState(false);

  // Track Lead event when user reaches success page
  useEffect(() => {
    if (typeof window !== 'undefined' && window.fbq) {
      window.fbq('track', 'Lead');
    }
  }, []);

  const fadeInUp = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
  };

  const copyToClipboard = () => {
    if (submissionId) {
      navigator.clipboard.writeText(submissionId);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center pt-20">
      {/* Background */}
      <div className="fixed inset-0 -z-10">
        <div className="absolute top-0 left-1/4 w-[600px] h-[600px] bg-primary-500/5 rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-1/4 w-[600px] h-[600px] bg-secondary-500/5 rounded-full blur-3xl" />
      </div>

      <div className="container-lg py-12 max-w-2xl">
        <motion.div
          className="text-center"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
        >
          {/* Icon */}
          <motion.div 
            className="flex justify-center mb-6"
            animate={{ scale: [1, 1.1, 1] }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            <div className="w-20 h-20 rounded-full bg-gradient-to-br from-green-400 to-green-600 flex items-center justify-center shadow-lg shadow-green-500/30">
              <CheckCircle2 className="w-10 h-10 text-white" />
            </div>
          </motion.div>

          {/* Main Message */}
          <motion.h1 
            className="text-4xl md:text-5xl font-bold mb-4 text-gray-900"
            variants={fadeInUp}
            initial="hidden"
            animate="visible"
            transition={{ delay: 0.2 }}
          >
            Website Generation Started! 🚀
          </motion.h1>

          <motion.p 
            className="text-xl text-gray-600 mb-8"
            variants={fadeInUp}
            initial="hidden"
            animate="visible"
            transition={{ delay: 0.3 }}
          >
            Your website is being created with AI-powered intelligence. This typically takes 30-60 seconds.
          </motion.p>

          {/* Details Box */}
          <motion.div 
            className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-2xl p-8 mb-8 border border-gray-200"
            variants={fadeInUp}
            initial="hidden"
            animate="visible"
            transition={{ delay: 0.4 }}
          >
            <p className="text-gray-600 mb-4">Your submission ID:</p>
            <div className="flex items-center justify-between bg-white rounded-lg p-4 border border-gray-200">
              <code className="text-sm md:text-base font-mono font-semibold text-primary-600">
                {submissionId || 'Loading...'}
              </code>
              <button
                onClick={copyToClipboard}
                className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
                title="Copy ID"
              >
                <Copy className="w-5 h-5 text-gray-600" />
              </button>
            </div>
            {copied && (
              <p className="text-sm text-green-600 mt-2">✓ Copied to clipboard</p>
            )}
          </motion.div>

          {/* What Happens Next */}
          <motion.div 
            className="bg-white rounded-2xl p-8 mb-8 border border-gray-200"
            variants={fadeInUp}
            initial="hidden"
            animate="visible"
            transition={{ delay: 0.5 }}
          >
            <h2 className="text-2xl font-bold text-gray-900 mb-6">What's happening now?</h2>
            
            <div className="space-y-4 text-left">
              <div className="flex gap-4">
                <div className="w-10 h-10 rounded-full bg-primary-100 flex items-center justify-center flex-shrink-0">
                  <span className="text-primary-700 font-bold">1</span>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 mb-1">Processing Your Input</h3>
                  <p className="text-gray-600">We're analyzing your business information and images...</p>
                </div>
              </div>

              <div className="flex gap-4">
                <div className="w-10 h-10 rounded-full bg-secondary-100 flex items-center justify-center flex-shrink-0">
                  <span className="text-secondary-700 font-bold">2</span>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 mb-1">AI Content Generation</h3>
                  <p className="text-gray-600">Creating compelling copy, headlines, and section content...</p>
                </div>
              </div>

              <div className="flex gap-4">
                <div className="w-10 h-10 rounded-full bg-accent-100 flex items-center justify-center flex-shrink-0">
                  <span className="text-accent-700 font-bold">3</span>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 mb-1">Design & Deployment</h3>
                  <p className="text-gray-600">Building your beautiful website and preparing for launch...</p>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Next Steps */}
          <motion.div 
            className="space-y-4"
            variants={fadeInUp}
            initial="hidden"
            animate="visible"
            transition={{ delay: 0.6 }}
          >
            <Link
              href="/dashboard"
              className="btn-primary btn-lg w-full flex items-center justify-center gap-2 group"
            >
              <Sparkles className="w-5 h-5" />
              Go to Dashboard
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </Link>
            
            <Link
              href="/"
              className="btn-secondary w-full"
            >
              Back to Home
            </Link>
          </motion.div>

          {/* Info Box */}
          <motion.div 
            className="mt-8 p-6 rounded-xl bg-blue-50 border border-blue-200"
            variants={fadeInUp}
            initial="hidden"
            animate="visible"
            transition={{ delay: 0.7 }}
          >
            <p className="text-sm text-gray-600">
              <strong>💡 Tip:</strong> You'll be able to review, customize, and deploy your website from the dashboard. Check back in a few moments!
            </p>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
}

export default function SuccessPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center pt-20">
        <div className="w-8 h-8 border-2 border-primary-600 border-t-transparent rounded-full animate-spin" />
      </div>
    }>
      <SuccessContent />
    </Suspense>
  );
}
