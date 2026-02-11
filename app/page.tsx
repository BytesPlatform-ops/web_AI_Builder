'use client';

import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import { useState, useEffect, useRef } from 'react';
import { ArrowRight, Check, Star, Clock } from 'lucide-react';

// ─── Typewriter Hook ───────────────────────────────────────────
function useTypewriter(words: string[], speed = 100, deleteSpeed = 50, pause = 2000) {
  const [text, setText] = useState('');
  const [wordIndex, setWordIndex] = useState(0);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    const current = words[wordIndex];
    const timeout = setTimeout(() => {
      if (!isDeleting) {
        setText(current.slice(0, text.length + 1));
        if (text.length === current.length) {
          setTimeout(() => setIsDeleting(true), pause);
        }
      } else {
        setText(current.slice(0, text.length - 1));
        if (text.length === 0) {
          setIsDeleting(false);
          setWordIndex((prev) => (prev + 1) % words.length);
        }
      }
    }, isDeleting ? deleteSpeed : speed);

    return () => clearTimeout(timeout);
  }, [text, isDeleting, wordIndex, words, speed, deleteSpeed, pause]);

  return text;
}

// ─── Animated Counter ──────────────────────────────────────────
function Counter({ target, suffix = '', duration = 2 }: { target: number; suffix?: string; duration?: number }) {
  const [count, setCount] = useState(0);
  const ref = useRef<HTMLSpanElement>(null);
  const [started, setStarted] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting && !started) setStarted(true); },
      { threshold: 0.5 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [started]);

  useEffect(() => {
    if (!started) return;
    const step = target / (duration * 60);
    const interval = setInterval(() => {
      setCount(prev => {
        if (prev + step >= target) { clearInterval(interval); return target; }
        return prev + step;
      });
    }, 1000 / 60);
    return () => clearInterval(interval);
  }, [started, target, duration]);

  return <span ref={ref}>{Math.round(count)}{suffix}</span>;
}

// ─── Terminal Animation ────────────────────────────────────────
const codeLines = [
  { text: '$ bytesuite build --business "Your Brand"', color: 'text-cyan-400', delay: 0 },
  { text: '  ✓ Analyzing your business...', color: 'text-gray-400', delay: 0.6 },
  { text: '  ✓ Creating professional content...', color: 'text-gray-400', delay: 1.2 },
  { text: '  ✓ Designing responsive layout...', color: 'text-gray-400', delay: 1.8 },
  { text: '  ✓ Optimizing for all devices...', color: 'text-gray-400', delay: 2.4 },
  { text: '  ✓ Website ready!', color: 'text-cyan-400', delay: 3.0 },
  { text: '', color: '', delay: 3.4 },
  { text: '  ✓ Live at → yourbrand.bytesuite.com', color: 'text-emerald-400', delay: 3.6 },
];

// ─── Animated Section Divider ──────────────────────────────────
function SectionDivider() {
  return (
    <div className="relative h-24 md:h-32 overflow-hidden">
      {/* Animated gradient line */}
      <motion.div
        className="absolute left-1/2 -translate-x-1/2 top-1/2 -translate-y-1/2 w-[200px] md:w-[400px] h-[1px]"
        initial={{ opacity: 0, scaleX: 0 }}
        whileInView={{ opacity: 1, scaleX: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8 }}
      >
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-cyan-500 to-transparent" />
      </motion.div>
      
      {/* Center glow dot */}
      <motion.div
        className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2"
        initial={{ opacity: 0, scale: 0 }}
        whileInView={{ opacity: 1, scale: 1 }}
        viewport={{ once: true }}
        transition={{ delay: 0.3 }}
      >
        <div className="w-2 h-2 rounded-full bg-cyan-400 shadow-[0_0_20px_rgba(34,211,238,0.8)]" />
      </motion.div>
    </div>
  );
}

// ─── Gradient Card Wrapper ─────────────────────────────────────
function GradientCard({ children, className = '', delay = 0, equalHeight = false }: { children: React.ReactNode; className?: string; delay?: number; equalHeight?: boolean }) {
  return (
    <motion.div
      className={`group relative ${equalHeight ? 'h-full' : ''} ${className}`}
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay }}
    >
      {/* Hover gradient border */}
      <div className="absolute -inset-[1px] rounded-2xl bg-gradient-to-r from-cyan-500 via-indigo-500 to-cyan-500 opacity-0 group-hover:opacity-100 blur-sm transition-all duration-500" />
      <div className="absolute -inset-[1px] rounded-2xl bg-gradient-to-r from-cyan-500 via-indigo-500 to-cyan-500 opacity-0 group-hover:opacity-60 transition-all duration-500" />
      
      {/* Card content */}
      <div className={`relative rounded-2xl border border-white/10 bg-[#0d1117] p-6 md:p-8 transition-all duration-500 group-hover:border-transparent group-hover:bg-[#0f1419] group-hover:shadow-lg group-hover:shadow-cyan-500/10 ${equalHeight ? 'h-full' : ''}`}>
        {children}
      </div>
    </motion.div>
  );
}

// ─── Main Page ─────────────────────────────────────────────────
export default function HomePage() {
  const typedText = useTypewriter([
    'Restaurant',
    'Startup',
    'Agency',
    'Portfolio',
    'Clinic',
    'Gym',
    'Salon',
    'Store',
  ], 100, 50, 1800);

  const [terminalVisible, setTerminalVisible] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setTerminalVisible(true), 500);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="bg-[#060910] text-white overflow-x-hidden">
      
      {/* ═══ NAV ═══ */}
      <nav className="fixed top-0 inset-x-0 z-50 bg-[#060910]/90 backdrop-blur-xl border-b border-cyan-500/10">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 h-14 md:h-16 flex items-center justify-between">
          <Link href="/" className="flex items-center group">
            <span className="font-bold text-lg md:text-xl text-white tracking-tight">ByteSuite</span>
          </Link>
          
          <div className="flex items-center gap-3 md:gap-4">
            <Link href="/login" className="text-sm text-gray-400 hover:text-white transition-colors">
              Login
            </Link>
            <Link 
              href="/get-started" 
              className="group relative inline-flex items-center gap-1.5 px-4 py-2 md:px-5 md:py-2.5 text-sm font-semibold rounded-xl overflow-hidden"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-cyan-500 to-indigo-500" />
              <span className="relative text-white">Get Started</span>
              <ArrowRight className="relative w-3.5 h-3.5 text-white group-hover:translate-x-0.5 transition-transform" />
            </Link>
          </div>
        </div>
      </nav>

      {/* ═══ HERO SECTION ═══ */}
      <section className="relative min-h-[100dvh] flex items-center pt-14 md:pt-16 pb-12">
        {/* Background Effects */}
        <div className="absolute inset-0 -z-10">
          {/* Main gradient orb */}
          <motion.div
            className="absolute top-[20%] left-[10%] w-[300px] md:w-[500px] h-[300px] md:h-[500px] bg-cyan-600/15 rounded-full blur-[100px] md:blur-[150px]"
            animate={{ x: [0, 20, 0], y: [0, -15, 0] }}
            transition={{ duration: 10, repeat: Infinity, ease: 'easeInOut' }}
          />
          <motion.div
            className="absolute bottom-[20%] right-[10%] w-[250px] md:w-[400px] h-[250px] md:h-[400px] bg-indigo-600/15 rounded-full blur-[80px] md:blur-[120px]"
            animate={{ x: [0, -15, 0], y: [0, 20, 0] }}
            transition={{ duration: 12, repeat: Infinity, ease: 'easeInOut' }}
          />
          
          {/* Subtle grid */}
          <div className="absolute inset-0 bg-[linear-gradient(rgba(34,211,238,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(34,211,238,0.03)_1px,transparent_1px)] bg-[size:40px_40px] md:bg-[size:60px_60px]" />
        </div>

        <div className="w-full max-w-6xl mx-auto px-4 sm:px-6">
          <div className="grid lg:grid-cols-2 gap-10 lg:gap-16 items-center">
            
            {/* Left Content */}
            <motion.div
              className="text-center lg:text-left"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              {/* Badge */}
              <motion.div
                className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-cyan-500/30 bg-gradient-to-r from-cyan-500/10 to-indigo-500/10 mb-6 md:mb-8 backdrop-blur-sm"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
              >
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75" />
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-cyan-400" />
                </span>
                <span className="text-xs md:text-sm font-medium text-cyan-300">Professional Website Builder</span>
              </motion.div>

              {/* Headline */}
              <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-extrabold tracking-tight leading-[1.15] mb-5 md:mb-6">
                <span className="text-white">We Build Your</span>
                <br />
                <span className="bg-gradient-to-r from-cyan-400 to-indigo-400 bg-clip-text text-transparent">
                  {typedText}
                </span>
                <motion.span
                  className="inline-block w-[2px] md:w-[3px] h-[0.85em] bg-cyan-400 ml-0.5 align-middle"
                  animate={{ opacity: [1, 0] }}
                  transition={{ duration: 0.6, repeat: Infinity, repeatType: 'reverse' }}
                />
                <br />
                <span className="text-white">Website in </span>
                <span className="bg-gradient-to-r from-cyan-400 to-emerald-400 bg-clip-text text-transparent">20 Minutes</span>
              </h1>

              {/* Subtitle */}
              <p className="text-base md:text-lg text-gray-400 max-w-lg mx-auto lg:mx-0 mb-6 md:mb-8 leading-relaxed">
                Fill a simple form. We build you a stunning, professional website — 
                ready to impress your customers. No coding required.
              </p>

              {/* CTA Button */}
              <div className="flex flex-col sm:flex-row gap-3 justify-center lg:justify-start">
                <Link
                  href="/get-started"
                  className="group relative inline-flex items-center justify-center gap-2 px-6 md:px-8 py-3.5 md:py-4 font-semibold rounded-xl overflow-hidden transition-all active:scale-[0.98] hover:scale-[1.02] shadow-lg shadow-cyan-500/20 hover:shadow-cyan-500/30"
                >
                  {/* Animated gradient background */}
                  <motion.div
                    className="absolute inset-0 bg-gradient-to-r from-cyan-500 via-indigo-500 to-cyan-500 bg-[length:200%_100%]"
                    animate={{ backgroundPosition: ['0% 0%', '100% 0%', '0% 0%'] }}
                    transition={{ duration: 3, repeat: Infinity, ease: 'linear' }}
                  />
                  {/* Shine effect */}
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700" />
                  <span className="relative text-white text-sm md:text-base">Build My Website</span>
                  <ArrowRight className="relative w-4 h-4 md:w-5 md:h-5 text-white group-hover:translate-x-1 transition-transform" />
                </Link>
                
                <Link
                  href="/login"
                  className="inline-flex items-center justify-center gap-2 px-6 py-3.5 text-gray-400 hover:text-cyan-400 transition-colors font-medium text-sm md:text-base"
                >
                  Login →
                </Link>
              </div>

              {/* Trust Indicators */}
              <motion.div 
                className="flex flex-wrap items-center justify-center lg:justify-start gap-3 md:gap-5 mt-8 md:mt-10"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.6 }}
              >
                <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/5 border border-white/10">
                  <div className="flex">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="w-3 h-3 fill-amber-400 text-amber-400" />
                    ))}
                  </div>
                  <span className="text-xs md:text-sm text-gray-400">500+ Websites</span>
                </div>
                <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/5 border border-white/10">
                  <Check className="w-3 h-3 text-cyan-400" />
                  <span className="text-xs md:text-sm text-gray-400">No Coding</span>
                </div>
                <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/5 border border-white/10">
                  <Clock className="w-3 h-3 text-cyan-400" />
                  <span className="text-xs md:text-sm text-gray-400">20 Min</span>
                </div>
              </motion.div>
            </motion.div>

            {/* Right: Terminal (Desktop only, hidden on mobile for cleaner look) */}
            <motion.div
              className="relative hidden lg:block"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
            >
              {/* Glow behind terminal */}
              <div className="absolute -inset-4 bg-gradient-to-br from-cyan-500/20 via-indigo-500/10 to-cyan-500/20 rounded-3xl blur-2xl" />
              
              {/* Terminal Window */}
              <div className="relative rounded-2xl border border-cyan-500/20 bg-[#0a0f14] shadow-2xl shadow-cyan-500/5 overflow-hidden">
                {/* Terminal Header */}
                <div className="flex items-center gap-2 px-4 py-3 bg-white/5 border-b border-white/5">
                  <div className="flex gap-1.5">
                    <div className="w-3 h-3 rounded-full bg-red-500/80" />
                    <div className="w-3 h-3 rounded-full bg-amber-500/80" />
                    <div className="w-3 h-3 rounded-full bg-emerald-500/80" />
                  </div>
                  <span className="text-xs text-gray-500 font-mono ml-2">terminal — bytesuite</span>
                </div>
                
                {/* Terminal Body */}
                <div className="p-5 font-mono text-sm space-y-1.5 min-h-[260px]">
                  <AnimatePresence>
                    {terminalVisible && codeLines.map((line, i) => (
                      <motion.div
                        key={i}
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: line.delay, duration: 0.3 }}
                        className={line.color}
                      >
                        {line.text || '\u00A0'}
                      </motion.div>
                    ))}
                  </AnimatePresence>
                  
                  {/* Blinking cursor */}
                  <motion.div
                    className="flex items-center gap-1 text-cyan-400"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 4.2 }}
                  >
                    <span>$</span>
                    <motion.span
                      className="inline-block w-2 h-4 bg-cyan-400"
                      animate={{ opacity: [1, 0] }}
                      transition={{ duration: 0.7, repeat: Infinity, repeatType: 'reverse' }}
                    />
                  </motion.div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>

        {/* Scroll Indicator */}
        <motion.div
          className="absolute bottom-6 left-1/2 -translate-x-1/2 hidden md:block"
          animate={{ y: [0, 6, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          <div className="w-5 h-8 rounded-full border-2 border-cyan-500/30 flex items-start justify-center p-1">
            <motion.div
              className="w-1 h-2 bg-cyan-400/60 rounded-full"
              animate={{ y: [0, 10, 0] }}
              transition={{ duration: 2, repeat: Infinity }}
            />
          </div>
        </motion.div>
      </section>

      <SectionDivider />

      {/* ═══ HOW IT WORKS ═══ */}
      <section className="py-16 md:py-24 px-4 sm:px-6">
        <div className="max-w-5xl mx-auto">
          {/* Section Header */}
          <motion.div
            className="text-center mb-12 md:mb-16"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <span className="text-xs font-mono text-cyan-400 tracking-[0.2em] uppercase mb-3 block">How It Works</span>
            <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold">
              Three Steps. <span className="bg-gradient-to-r from-cyan-400 to-indigo-400 bg-clip-text text-transparent">That&apos;s It.</span>
            </h2>
          </motion.div>

          {/* Steps Grid */}
          <div className="grid md:grid-cols-3 gap-4 md:gap-6 relative">
            {/* Connecting line (desktop) */}
            <div className="hidden md:block absolute top-[52px] left-[20%] right-[20%] h-[2px]">
              <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/60 via-indigo-500/60 to-cyan-500/60" />
              <motion.div
                className="absolute inset-y-0 left-0 w-8 bg-gradient-to-r from-cyan-400 to-transparent"
                animate={{ x: ['0%', '1000%', '0%'] }}
                transition={{ duration: 5, repeat: Infinity, ease: 'linear' }}
              />
            </div>

            {[
              { num: '01', title: 'Fill the Form', desc: 'Enter your business name, services, upload logo and images. Takes just 2 minutes.', gradient: 'from-cyan-500 to-cyan-600' },
              { num: '02', title: 'We Build It', desc: 'Our system generates your professional website with stunning design in under 20 minutes.', gradient: 'from-indigo-500 to-indigo-600' },
              { num: '03', title: 'Go Live', desc: 'Preview your site, make any edits you want, then publish instantly with one click.', gradient: 'from-cyan-500 to-indigo-500' },
            ].map((step, i) => (
              <GradientCard key={step.num} delay={i * 0.1} equalHeight>
                {/* Step number */}
                <div className={`inline-flex items-center justify-center w-11 h-11 md:w-12 md:h-12 rounded-xl bg-gradient-to-br ${step.gradient} text-white font-bold text-base md:text-lg mb-4 md:mb-5 shadow-lg shadow-cyan-500/20`}>
                  {step.num}
                </div>
                <h3 className="text-lg md:text-xl font-bold text-white mb-2 md:mb-3">{step.title}</h3>
                <p className="text-gray-400 text-sm md:text-base leading-relaxed">{step.desc}</p>
              </GradientCard>
            ))}
          </div>
        </div>
      </section>

      <SectionDivider />

      {/* ═══ STATS + FEATURES ═══ */}
      <section className="py-16 md:py-24 px-4 sm:px-6">
        <div className="max-w-6xl mx-auto">
          {/* Section Header */}
          <motion.div
            className="text-center mb-12 md:mb-16"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <span className="text-xs font-mono text-indigo-400 tracking-[0.2em] uppercase mb-3 block">Why ByteSuite</span>
            <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold mb-3 md:mb-4">
              Your Website, <span className="bg-gradient-to-r from-cyan-400 to-indigo-400 bg-clip-text text-transparent">Our Expertise</span>
            </h2>
            <p className="text-gray-400 max-w-xl mx-auto text-sm md:text-base">
              We don&apos;t just create pages — we build websites that turn visitors into customers.
            </p>
          </motion.div>

          {/* Stats Grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4 mb-10 md:mb-12">
            {[
              { value: 500, suffix: '+', label: 'Websites Built' },
              { value: 20, suffix: 'min', label: 'Build Time' },
              { value: 99, suffix: '%', label: 'Satisfaction' },
              { value: 24, suffix: '/7', label: 'Support' },
            ].map((stat, i) => (
              <GradientCard key={stat.label} delay={i * 0.05} className="text-center">
                <div className="text-2xl sm:text-3xl md:text-4xl font-bold bg-gradient-to-r from-cyan-400 to-indigo-400 bg-clip-text text-transparent mb-1">
                  <Counter target={stat.value} suffix={stat.suffix} />
                </div>
                <div className="text-xs md:text-sm text-gray-500">{stat.label}</div>
              </GradientCard>
            ))}
          </div>

          {/* Features Grid */}
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3 md:gap-4">
            {[
              { title: 'Lightning Fast', desc: 'Your website ready in 20 minutes' },
              { title: 'Mobile Perfect', desc: 'Looks stunning on every device' },
              { title: 'SEO Optimized', desc: 'Built to rank higher on Google' },
              { title: 'Custom Design', desc: 'Unique to your brand identity' },
              { title: 'Secure Hosting', desc: 'Enterprise-grade infrastructure' },
              { title: 'One-Click Launch', desc: 'Go live with a single click' },
            ].map((feature, i) => (
              <GradientCard key={feature.title} delay={i * 0.05}>
                <div>
                  <h4 className="font-semibold text-white text-sm md:text-base mb-1">{feature.title}</h4>
                  <p className="text-xs md:text-sm text-gray-500">{feature.desc}</p>
                </div>
              </GradientCard>
            ))}
          </div>
        </div>
      </section>

      <SectionDivider />

      {/* ═══ FINAL CTA ═══ */}
      <section className="py-16 md:py-24 px-4 sm:px-6">
        <div className="max-w-3xl mx-auto">
          <motion.div
            className="relative rounded-2xl md:rounded-3xl overflow-hidden"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            {/* Animated gradient border */}
            <motion.div
              className="absolute -inset-[2px] rounded-2xl md:rounded-3xl bg-gradient-to-r from-cyan-500 via-indigo-500 to-cyan-500 bg-[length:200%_100%] opacity-70"
              animate={{ backgroundPosition: ['0% 0%', '100% 0%', '0% 0%'] }}
              transition={{ duration: 4, repeat: Infinity, ease: 'linear' }}
            />
            
            {/* Card content */}
            <div className="relative rounded-2xl md:rounded-3xl bg-gradient-to-br from-[#0a1520] to-[#0d0f18] px-6 py-12 md:px-12 md:py-16 text-center">
              {/* Animated glowing orb */}
              <motion.div
                className="relative w-16 h-16 md:w-20 md:h-20 mx-auto mb-6 md:mb-8"
                animate={{ scale: [1, 1.05, 1] }}
                transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
              >
                <div className="absolute inset-0 rounded-full bg-gradient-to-br from-cyan-400 to-indigo-500 blur-xl opacity-60" />
                <div className="absolute inset-0 rounded-full bg-gradient-to-br from-cyan-400 to-indigo-500 flex items-center justify-center">
                  <ArrowRight className="w-7 h-7 md:w-8 md:h-8 text-white" />
                </div>
              </motion.div>
              
              <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold mb-4 md:mb-6">
                Ready to Launch Your
                <br />
                <span className="bg-gradient-to-r from-cyan-400 to-indigo-400 bg-clip-text text-transparent">
                  Dream Website?
                </span>
              </h2>
              
              <p className="text-sm md:text-lg text-gray-400 max-w-md mx-auto mb-8 md:mb-10">
                Join 500+ businesses who launched their stunning website with ByteSuite. 
                Get started today.
              </p>

              <Link
                href="/get-started"
                className="group relative inline-flex items-center gap-2 px-8 md:px-10 py-3.5 md:py-4 font-semibold text-base md:text-lg rounded-xl overflow-hidden transition-all hover:scale-[1.02] active:scale-[0.98]"
              >
                <motion.div
                  className="absolute inset-0 bg-gradient-to-r from-cyan-500 via-indigo-500 to-cyan-500 bg-[length:200%_100%]"
                  animate={{ backgroundPosition: ['0% 0%', '100% 0%', '0% 0%'] }}
                  transition={{ duration: 3, repeat: Infinity, ease: 'linear' }}
                />
                <span className="relative">Start Building Now</span>
                <ArrowRight className="relative w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ═══ FOOTER ═══ */}
      <footer className="border-t border-cyan-500/10 py-6 md:py-8 px-4 sm:px-6">
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="flex items-center">
              <span className="font-bold text-gray-400">ByteSuite</span>
            </div>
            <div className="flex items-center gap-6 text-sm text-gray-500">
              <Link href="/" className="hover:text-cyan-400 transition">Home</Link>
              <Link href="/get-started" className="hover:text-cyan-400 transition">Get Started</Link>
              <Link href="/login" className="hover:text-cyan-400 transition">Login</Link>
            </div>
            <p className="text-xs md:text-sm text-gray-600">
              &copy; {new Date().getFullYear()} ByteSuite
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
