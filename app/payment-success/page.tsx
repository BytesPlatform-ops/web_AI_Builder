'use client';

import { useSearchParams, useRouter } from 'next/navigation';
import { Suspense, useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { 
  CheckCircle2, 
  Loader2, 
  ExternalLink, 
  Copy, 
  Check,
  Globe,
  Shield,
  Zap,
  Sparkles,
  PartyPopper,
  Home,
  Link2,
  Crown,
  Star
} from 'lucide-react';
import Link from 'next/link';
import confetti from 'canvas-confetti';

interface VerificationResult {
  success: boolean;
  paid: boolean;
  published: boolean;
  deploymentUrl?: string;
  error?: string;
}

function PaymentSuccessContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const sessionId = searchParams.get('session_id');
  const websiteId = searchParams.get('website_id');
  
  const [status, setStatus] = useState<'verifying' | 'publishing' | 'success' | 'error'>('verifying');
  const [deploymentUrl, setDeploymentUrl] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const [copiedCname, setCopiedCname] = useState(false);
  const [copiedA, setCopiedA] = useState(false);
  const [businessName, setBusinessName] = useState<string>('');

  // Confetti effect on success
  const triggerConfetti = () => {
    const duration = 3000;
    const end = Date.now() + duration;

    const frame = () => {
      confetti({
        particleCount: 3,
        angle: 60,
        spread: 55,
        origin: { x: 0, y: 0.8 },
        colors: ['#3b82f6', '#06b6d4', '#10b981', '#8b5cf6']
      });
      confetti({
        particleCount: 3,
        angle: 120,
        spread: 55,
        origin: { x: 1, y: 0.8 },
        colors: ['#3b82f6', '#06b6d4', '#10b981', '#8b5cf6']
      });

      if (Date.now() < end) {
        requestAnimationFrame(frame);
      }
    };
    frame();
  };

  useEffect(() => {
    if (!sessionId || !websiteId) {
      setError('Missing payment information. Please contact support.');
      setStatus('error');
      return;
    }

    const verifyAndPublish = async () => {
      try {
        setStatus('verifying');
        
        // Call the verify API which will also handle deployment
        const response = await fetch('/api/stripe/verify', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            sessionId,
            websiteId,
          }),
        });

        const data: VerificationResult = await response.json();

        if (!response.ok) {
          throw new Error(data.error || 'Verification failed');
        }

        if (data.paid && data.published && data.deploymentUrl) {
          setDeploymentUrl(data.deploymentUrl);
          setStatus('success');
          
          // Trigger confetti celebration
          setTimeout(() => {
            triggerConfetti();
          }, 500);
        } else if (data.paid && !data.published) {
          setStatus('publishing');
          // Poll for completion
          pollForPublish();
        } else {
          throw new Error('Payment verification failed. Please contact support.');
        }
      } catch (err) {
        console.error('Verification error:', err);
        setError(err instanceof Error ? err.message : 'Something went wrong');
        setStatus('error');
      }
    };

    const pollForPublish = async () => {
      let attempts = 0;
      const maxAttempts = 30; // 30 seconds timeout
      
      const poll = async () => {
        try {
          const response = await fetch('/api/stripe/verify', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              sessionId,
              websiteId,
            }),
          });

          const data: VerificationResult = await response.json();

          if (data.published && data.deploymentUrl) {
            setDeploymentUrl(data.deploymentUrl);
            setStatus('success');
            setTimeout(() => {
              triggerConfetti();
            }, 500);
            return;
          }

          attempts++;
          if (attempts < maxAttempts) {
            setTimeout(poll, 1000);
          } else {
            setError('Publishing is taking longer than expected. Check your dashboard.');
            setStatus('error');
          }
        } catch {
          attempts++;
          if (attempts < maxAttempts) {
            setTimeout(poll, 1000);
          }
        }
      };

      poll();
    };

    // Fetch website info for business name
    const fetchWebsiteInfo = async () => {
      try {
        const response = await fetch('/api/user/website');
        const data = await response.json();
        if (data.website?.businessName) {
          setBusinessName(data.website.businessName);
        }
      } catch {
        // Ignore errors
      }
    };

    fetchWebsiteInfo();
    verifyAndPublish();
  }, [sessionId, websiteId]);

  const copyToClipboard = () => {
    if (deploymentUrl) {
      navigator.clipboard.writeText(deploymentUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  // Loading/Verifying state
  if (status === 'verifying' || status === 'publishing') {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ background: 'linear-gradient(135deg, #0a0a0a 0%, #1a1a2e 50%, #0a0a0a 100%)' }}>
        <div className="text-center px-4">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
            className="w-24 h-24 mx-auto mb-8"
          >
            <div className="w-full h-full rounded-full border-4 border-amber-500/30 border-t-amber-400" style={{ boxShadow: '0 0 30px rgba(251, 191, 36, 0.3)' }} />
          </motion.div>
          
          <motion.h2 
            className="text-2xl md:text-3xl font-bold mb-4"
            style={{ color: '#fbbf24' }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            {status === 'verifying' ? 'Verifying Payment...' : 'Publishing Your Website...'}
          </motion.h2>
          
          <motion.p 
            className="text-gray-400 text-lg"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
          >
            {status === 'verifying' 
              ? 'Please wait while we confirm your payment'
              : 'Your website is being deployed to the cloud'
            }
          </motion.p>

          <motion.div 
            className="flex items-center justify-center gap-2 mt-6 text-amber-400"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
          >
            <Loader2 className="w-5 h-5 animate-spin" />
            <span>This usually takes 10-30 seconds</span>
          </motion.div>
        </div>
      </div>
    );
  }

  // Error state
  if (status === 'error') {
    return (
      <div className="min-h-screen flex items-center justify-center px-4" style={{ background: 'linear-gradient(135deg, #0a0a0a 0%, #1a0a0a 50%, #0a0a0a 100%)' }}>
        <div className="text-center max-w-md">
          <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-red-500/20 flex items-center justify-center" style={{ boxShadow: '0 0 30px rgba(239, 68, 68, 0.3)' }}>
            <span className="text-4xl">⚠️</span>
          </div>
          
          <h2 className="text-2xl font-bold text-white mb-4">Something Went Wrong</h2>
          <p className="text-gray-400 mb-6">{error}</p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/my-website"
              className="px-6 py-3 bg-gradient-to-r from-amber-500 to-orange-500 text-black font-semibold rounded-xl hover:from-amber-400 hover:to-orange-400 transition-colors"
            >
              Go to Dashboard
            </Link>
            <a
              href="mailto:support@example.com"
              className="px-6 py-3 border border-gray-700 text-gray-300 rounded-xl font-medium hover:bg-gray-800/50 transition-colors"
            >
              Contact Support
            </a>
          </div>
        </div>
      </div>
    );
  }

  // Success state - Premium Dark Theme
  return (
    <div className="min-h-screen py-8 px-4" style={{ background: 'linear-gradient(135deg, #0a0a0a 0%, #0f1419 50%, #0a0a0a 100%)' }}>
      <div className="max-w-3xl mx-auto">
        {/* Success Header */}
        <motion.div 
          className="text-center mb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          {/* Premium Badge */}
          <motion.div 
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full mb-6"
            style={{ background: 'linear-gradient(135deg, rgba(251, 191, 36, 0.2) 0%, rgba(245, 158, 11, 0.1) 100%)', border: '1px solid rgba(251, 191, 36, 0.3)' }}
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.1 }}
          >
            <Crown className="w-5 h-5 text-amber-400" />
            <span className="text-amber-400 font-semibold text-sm">PRO MEMBER</span>
            <Star className="w-4 h-4 text-amber-400 fill-amber-400" />
          </motion.div>

          <motion.div 
            className="w-28 h-28 mx-auto mb-6 rounded-full flex items-center justify-center"
            style={{ 
              background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
              boxShadow: '0 0 60px rgba(16, 185, 129, 0.4), 0 0 100px rgba(16, 185, 129, 0.2)'
            }}
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", stiffness: 200, damping: 15 }}
          >
            <CheckCircle2 className="w-14 h-14 text-white" />
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <div className="flex items-center justify-center gap-3 mb-4">
              <PartyPopper className="w-8 h-8 text-amber-400" />
              <h1 className="text-3xl md:text-5xl font-bold text-white">
                Congratulations!
              </h1>
              <PartyPopper className="w-8 h-8 text-amber-400 transform scale-x-[-1]" />
            </div>
            <p className="text-xl text-gray-300">
              Your website is now <span className="text-emerald-400 font-bold">LIVE</span> on the internet!
            </p>
          </motion.div>
        </motion.div>

        {/* Website URL Card - Premium */}
        <motion.div
          className="rounded-3xl p-6 md:p-8 mb-6 relative overflow-hidden"
          style={{
            background: 'linear-gradient(135deg, #111827 0%, #1f2937 100%)',
            border: '1px solid rgba(16, 185, 129, 0.3)',
            boxShadow: '0 0 40px rgba(16, 185, 129, 0.1)'
          }}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          {/* Glow effect */}
          <div className="absolute top-0 right-0 w-64 h-64 rounded-full opacity-30" style={{ background: 'radial-gradient(circle, rgba(16, 185, 129, 0.3) 0%, transparent 70%)' }} />
          
          <div className="relative">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-full bg-emerald-500/20 flex items-center justify-center">
                <Globe className="w-5 h-5 text-emerald-400" />
              </div>
              <h2 className="text-xl font-bold text-white">
                {businessName ? `${businessName} is Live!` : 'Your Website URL'}
              </h2>
            </div>

            <div className="flex items-center gap-3 rounded-xl p-4" style={{ background: 'rgba(0, 0, 0, 0.4)', border: '1px solid rgba(255, 255, 255, 0.1)' }}>
              <input
                type="text"
                value={deploymentUrl || ''}
                readOnly
                className="flex-1 bg-transparent text-emerald-300 font-mono text-sm md:text-base outline-none"
              />
              <button
                onClick={copyToClipboard}
                className="p-2.5 rounded-lg bg-emerald-500/20 text-emerald-400 hover:bg-emerald-500/30 transition-colors"
                title="Copy URL"
              >
                {copied ? <Check className="w-5 h-5" /> : <Copy className="w-5 h-5" />}
              </button>
              <a
                href={deploymentUrl || '#'}
                target="_blank"
                rel="noopener noreferrer"
                className="p-2.5 rounded-lg bg-emerald-500/20 text-emerald-400 hover:bg-emerald-500/30 transition-colors"
                title="Open Website"
              >
                <ExternalLink className="w-5 h-5" />
              </a>
            </div>

            {/* Visit Website Button */}
            <a
              href={deploymentUrl || '#'}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-5 w-full py-4 px-6 rounded-xl text-white font-bold text-lg transition-all flex items-center justify-center gap-3"
              style={{ 
                background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
                boxShadow: '0 4px 20px rgba(16, 185, 129, 0.4)'
              }}
            >
              <Globe className="w-5 h-5" />
              Visit Your Live Website
              <ExternalLink className="w-5 h-5" />
            </a>
          </div>
        </motion.div>

        {/* What's Included - Premium */}
        <motion.div
          className="rounded-2xl p-6 mb-6"
          style={{ background: 'rgba(17, 24, 39, 0.6)', border: '1px solid rgba(255, 255, 255, 0.1)' }}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-amber-400" />
            What&apos;s Included in Your Plan
          </h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { icon: Globe, text: 'Free Hosting', color: 'text-emerald-400' },
              { icon: Shield, text: 'SSL Certificate', color: 'text-emerald-400' },
              { icon: Zap, text: '99.9% Uptime', color: 'text-amber-400' },
              { icon: CheckCircle2, text: 'No Watermark', color: 'text-emerald-400' },
            ].map((item) => (
              <div key={item.text} className="flex items-center gap-2 text-gray-300">
                <item.icon className={`w-4 h-4 ${item.color}`} />
                <span className="text-sm">{item.text}</span>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Custom Domain Section - NEW */}
        <motion.div
          className="rounded-2xl p-6 mb-6"
          style={{ 
            background: 'linear-gradient(135deg, rgba(139, 92, 246, 0.1) 0%, rgba(168, 85, 247, 0.05) 100%)', 
            border: '1px solid rgba(139, 92, 246, 0.3)' 
          }}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
        >
          <div className="flex items-center gap-3 mb-5">
            <div className="w-10 h-10 rounded-full bg-purple-500/20 flex items-center justify-center">
              <Link2 className="w-5 h-5 text-purple-400" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-white">Connect Your Custom Domain</h3>
              <p className="text-sm text-gray-400">Use your own domain like yourbusiness.com</p>
            </div>
          </div>

          {/* DNS Instructions */}
          <div className="space-y-4">
            {/* Step 1 */}
            <div className="flex gap-3">
              <span className="flex-shrink-0 w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold text-purple-300" style={{ background: 'rgba(139, 92, 246, 0.3)' }}>1</span>
              <div>
                <p className="text-sm font-medium text-white">Go to your domain registrar</p>
                <p className="text-xs text-gray-500 mt-0.5">GoDaddy, Namecheap, Cloudflare, Google Domains, etc.</p>
              </div>
            </div>

            {/* Step 2 - CNAME */}
            <div className="flex gap-3">
              <span className="flex-shrink-0 w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold text-purple-300" style={{ background: 'rgba(139, 92, 246, 0.3)' }}>2</span>
              <div className="flex-1">
                <p className="text-sm font-medium text-white">Add a CNAME record for www</p>
                <div className="mt-2 rounded-lg p-3 space-y-2" style={{ background: 'rgba(0, 0, 0, 0.3)', border: '1px solid rgba(255, 255, 255, 0.1)' }}>
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-gray-500">Type</span>
                    <code className="font-mono font-semibold text-purple-300">CNAME</code>
                  </div>
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-gray-500">Name / Host</span>
                    <code className="font-mono font-semibold text-purple-300">www</code>
                  </div>
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-gray-500">Value / Points to</span>
                    <div className="flex items-center gap-2">
                      <code className="font-mono font-semibold text-purple-300 text-xs">
                        {deploymentUrl?.replace('https://', '').replace('http://', '').replace(/\/$/, '')}
                      </code>
                      <button
                        onClick={() => {
                          const target = deploymentUrl?.replace('https://', '').replace('http://', '').replace(/\/$/, '') || ""
                          navigator.clipboard.writeText(target)
                          setCopiedCname(true)
                          setTimeout(() => setCopiedCname(false), 2000)
                        }}
                        className="p-1 rounded hover:bg-purple-500/20"
                        title="Copy"
                      >
                        {copiedCname ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3 text-gray-400" />}
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Step 3 - A Record */}
            <div className="flex gap-3">
              <span className="flex-shrink-0 w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold text-purple-300" style={{ background: 'rgba(139, 92, 246, 0.3)' }}>3</span>
              <div className="flex-1">
                <p className="text-sm font-medium text-white">Add an A record for root domain</p>
                <p className="text-xs text-gray-500 mt-0.5">For yourbusiness.com without www</p>
                <div className="mt-2 rounded-lg p-3 space-y-2" style={{ background: 'rgba(0, 0, 0, 0.3)', border: '1px solid rgba(255, 255, 255, 0.1)' }}>
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-gray-500">Type</span>
                    <code className="font-mono font-semibold text-purple-300">A</code>
                  </div>
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-gray-500">Name / Host</span>
                    <code className="font-mono font-semibold text-purple-300">@</code>
                  </div>
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-gray-500">Value / Points to</span>
                    <div className="flex items-center gap-2">
                      <code className="font-mono font-semibold text-purple-300">75.2.60.5</code>
                      <button
                        onClick={() => {
                          navigator.clipboard.writeText("75.2.60.5")
                          setCopiedA(true)
                          setTimeout(() => setCopiedA(false), 2000)
                        }}
                        className="p-1 rounded hover:bg-purple-500/20"
                        title="Copy"
                      >
                        {copiedA ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3 text-gray-400" />}
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Help note */}
            <div className="rounded-xl p-4 mt-4" style={{ background: 'rgba(139, 92, 246, 0.15)', border: '1px solid rgba(139, 92, 246, 0.2)' }}>
              <p className="text-xs text-purple-200">
                <strong>Need help?</strong> Contact our team and we&apos;ll set up your custom domain for you at no extra charge. DNS changes can take up to 48 hours to propagate.
              </p>
            </div>
          </div>
        </motion.div>

        {/* Actions */}
        <motion.div
          className="flex flex-col sm:flex-row gap-4"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
        >
          <Link
            href="/my-website"
            className="flex-1 py-3.5 px-6 rounded-xl font-semibold text-center flex items-center justify-center gap-2 transition-all"
            style={{ 
              background: 'linear-gradient(135deg, #fbbf24 0%, #f59e0b 100%)',
              color: '#000'
            }}
          >
            <Home className="w-5 h-5" />
            Go to Dashboard
          </Link>
          <Link
            href="/my-website/edit"
            className="flex-1 py-3.5 px-6 rounded-xl font-semibold text-center transition-all text-gray-300 hover:text-white"
            style={{ border: '1px solid rgba(255, 255, 255, 0.2)', background: 'rgba(255, 255, 255, 0.05)' }}
          >
            Edit Website
          </Link>
        </motion.div>

        {/* Share prompt */}
        <motion.p
          className="text-center text-gray-500 text-sm mt-8"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.7 }}
        >
          🎉 Share your new website with friends and customers!
        </motion.p>
      </div>
    </div>
  );
}

export default function PaymentSuccessPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900">
        <Loader2 className="w-12 h-12 text-blue-500 animate-spin" />
      </div>
    }>
      <PaymentSuccessContent />
    </Suspense>
  );
}
