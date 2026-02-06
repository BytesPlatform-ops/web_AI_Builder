'use client';

import { Suspense } from 'react';
import { motion } from 'framer-motion';
import { CheckCircle2, Mail, Globe, Sparkles } from 'lucide-react';
import Link from 'next/link';

function SuccessContent() {
  return (
    <div className="min-h-screen flex items-center justify-center px-4 bg-gradient-to-b from-green-50/40 via-white to-white">
      <div className="max-w-lg w-full py-16">
        <motion.div
          className="text-center"
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
        >
          {/* Success Icon */}
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: 'spring', stiffness: 200, delay: 0.15 }}
            className="w-20 h-20 bg-gradient-to-br from-green-400 to-emerald-500 rounded-2xl flex items-center justify-center mx-auto mb-8 shadow-lg shadow-green-500/25"
          >
            <CheckCircle2 className="w-10 h-10 text-white" />
          </motion.div>

          {/* Heading */}
          <motion.h1
            className="text-3xl sm:text-4xl font-bold text-gray-900 mb-3"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.25 }}
          >
            Your website is being built!
          </motion.h1>

          <motion.p
            className="text-lg text-gray-500 mb-10"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.35 }}
          >
            We&apos;ll send your login credentials via email once it&apos;s ready.
          </motion.p>

          {/* Steps Card */}
          <motion.div
            className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6 sm:p-8 text-left mb-8"
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.45 }}
          >
            <h2 className="font-semibold text-gray-900 mb-5">What happens next</h2>
            <div className="space-y-5">
              <div className="flex items-start gap-4">
                <div className="w-9 h-9 rounded-xl bg-indigo-100 flex items-center justify-center flex-shrink-0">
                  <Sparkles className="w-4 h-4 text-indigo-600" />
                </div>
                <div>
                  <p className="font-medium text-gray-900 text-sm">Building your website now</p>
                  <p className="text-sm text-gray-500">This usually takes about 2 minutes</p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <div className="w-9 h-9 rounded-xl bg-emerald-100 flex items-center justify-center flex-shrink-0">
                  <Mail className="w-4 h-4 text-emerald-600" />
                </div>
                <div>
                  <p className="font-medium text-gray-900 text-sm">Check your email</p>
                  <p className="text-sm text-gray-500">We&apos;ll email you login credentials shortly</p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <div className="w-9 h-9 rounded-xl bg-purple-100 flex items-center justify-center flex-shrink-0">
                  <Globe className="w-4 h-4 text-purple-600" />
                </div>
                <div>
                  <p className="font-medium text-gray-900 text-sm">Preview and publish</p>
                  <p className="text-sm text-gray-500">Login to customize and make your site live</p>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Action */}
          <motion.div
            className="space-y-3"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6 }}
          >
            <Link
              href="/login"
              className="block w-full text-center bg-gradient-to-r from-indigo-600 to-purple-600 text-white py-3 px-6 rounded-xl font-semibold hover:from-indigo-700 hover:to-purple-700 transition-all shadow-md shadow-indigo-500/25"
            >
              Go to Login
            </Link>
            <Link
              href="/get-started"
              className="block w-full text-center text-gray-500 hover:text-gray-700 text-sm py-2 transition-colors"
            >
              Build another website
            </Link>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
}

export default function SuccessPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center">
          <div className="w-8 h-8 border-2 border-indigo-600 border-t-transparent rounded-full animate-spin" />
        </div>
      }
    >
      <SuccessContent />
    </Suspense>
  );
}
