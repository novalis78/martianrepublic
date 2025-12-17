'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useEffect, useState, useRef } from 'react';

// Animated counter component
function AnimatedCounter({ end, duration = 2000, suffix = '' }: { end: number; duration?: number; suffix?: string }) {
  const [count, setCount] = useState(0);
  const countRef = useRef<HTMLSpanElement>(null);
  const hasAnimated = useRef(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && !hasAnimated.current) {
          hasAnimated.current = true;
          const startTime = Date.now();
          const animate = () => {
            const elapsed = Date.now() - startTime;
            const progress = Math.min(elapsed / duration, 1);
            // Easing function for smooth animation
            const easeOutQuart = 1 - Math.pow(1 - progress, 4);
            setCount(Math.floor(end * easeOutQuart));
            if (progress < 1) requestAnimationFrame(animate);
          };
          animate();
        }
      },
      { threshold: 0.5 }
    );

    if (countRef.current) observer.observe(countRef.current);
    return () => observer.disconnect();
  }, [end, duration]);

  return <span ref={countRef}>{count.toLocaleString()}{suffix}</span>;
}

// Orbital rings decoration
function OrbitalRings() {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px]">
        {[1, 2, 3].map((i) => (
          <div
            key={i}
            className="absolute inset-0 rounded-full border border-mars-rust/10"
            style={{
              transform: `rotate(${i * 30}deg)`,
              animation: `rotate ${40 + i * 10}s linear infinite`,
            }}
          />
        ))}
      </div>
    </div>
  );
}

// Data stream decoration
function DataStream() {
  return (
    <div className="absolute right-0 top-0 bottom-0 w-px overflow-hidden opacity-30">
      <div className="animate-data-stream">
        {Array.from({ length: 50 }).map((_, i) => (
          <div
            key={i}
            className="h-1 w-px bg-colony-cyan mb-4"
            style={{ opacity: Math.random() * 0.5 + 0.5 }}
          />
        ))}
        {Array.from({ length: 50 }).map((_, i) => (
          <div
            key={i + 50}
            className="h-1 w-px bg-colony-cyan mb-4"
            style={{ opacity: Math.random() * 0.5 + 0.5 }}
          />
        ))}
      </div>
    </div>
  );
}

// Feature card component
function FeatureCard({
  href,
  icon,
  title,
  description,
  badge,
  index
}: {
  href: string;
  icon: React.ReactNode;
  title: string;
  description: string;
  badge?: string;
  index: number;
}) {
  return (
    <Link
      href={href}
      className="group relative block opacity-0 animate-slide-up"
      style={{ animationDelay: `${index * 100 + 400}ms`, animationFillMode: 'forwards' }}
    >
      {/* Card */}
      <div className="relative h-full p-6 clip-corner-sm bg-gradient-to-br from-void-700/50 to-void-900/80 border border-white/5 transition-all duration-500 group-hover:border-mars-rust/30 group-hover:bg-void-700/70">
        {/* Hover glow */}
        <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none">
          <div className="absolute inset-0 bg-gradient-to-br from-mars-rust/5 to-transparent" />
        </div>

        {/* Corner accent */}
        <div className="absolute top-0 right-0 w-8 h-8">
          <div className="absolute top-0 right-0 w-full h-px bg-gradient-to-l from-mars-rust/50 to-transparent" />
          <div className="absolute top-0 right-0 h-full w-px bg-gradient-to-b from-mars-rust/50 to-transparent" />
        </div>

        {/* Badge */}
        {badge && (
          <div className="absolute top-4 right-4">
            <span className="badge badge-mars text-2xs">{badge}</span>
          </div>
        )}

        {/* Icon */}
        <div className="relative w-12 h-12 mb-4 flex items-center justify-center">
          <div className="absolute inset-0 bg-mars-rust/20 clip-corner-sm" />
          <div className="relative text-mars-400 group-hover:text-mars-300 transition-colors">
            {icon}
          </div>
        </div>

        {/* Content */}
        <h3 className="font-display text-lg font-semibold text-void-100 mb-2 group-hover:text-mars-dust transition-colors">
          {title}
        </h3>
        <p className="text-sm text-void-300 leading-relaxed mb-4">
          {description}
        </p>

        {/* Link indicator */}
        <div className="flex items-center text-sm font-display font-medium text-mars-rust group-hover:text-colony-cyan transition-colors">
          <span className="uppercase tracking-wider text-xs">Access</span>
          <svg className="w-4 h-4 ml-2 transform group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
          </svg>
        </div>
      </div>
    </Link>
  );
}

// Pillar card component
function PillarCard({
  icon,
  title,
  description,
  index
}: {
  icon: React.ReactNode;
  title: string;
  description: string;
  index: number;
}) {
  return (
    <div
      className="relative opacity-0 animate-slide-up"
      style={{ animationDelay: `${index * 150 + 200}ms`, animationFillMode: 'forwards' }}
    >
      {/* Vertical line connector */}
      <div className="absolute left-6 top-16 bottom-0 w-px bg-gradient-to-b from-mars-rust/30 to-transparent hidden md:block" />

      <div className="relative flex gap-5">
        {/* Icon */}
        <div className="relative flex-shrink-0">
          <div className="w-12 h-12 bg-mars-rust/20 rounded-sm flex items-center justify-center border border-mars-rust/30">
            <div className="text-mars-400">
              {icon}
            </div>
          </div>
          {/* Pulse ring */}
          <div className="absolute inset-0 rounded-sm border border-mars-rust/20 animate-ping" style={{ animationDuration: '3s' }} />
        </div>

        {/* Content */}
        <div className="pt-1">
          <h3 className="font-display text-xl font-semibold text-void-100 mb-2">
            {title}
          </h3>
          <p className="text-void-300 leading-relaxed">
            {description}
          </p>
        </div>
      </div>
    </div>
  );
}

export default function Home() {
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    setIsLoaded(true);
  }, []);

  return (
    <main className="relative min-h-screen overflow-hidden">
      {/* ============================================
          HERO SECTION
          ============================================ */}
      <section className="relative min-h-screen flex items-center justify-center">
        {/* Background layers */}
        <div className="absolute inset-0 bg-hero-radial" />
        <OrbitalRings />

        {/* Grid pattern overlay */}
        <div className="absolute inset-0 bg-grid-pattern opacity-50" />

        {/* Atmospheric glow */}
        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[120%] h-[60%] bg-gradient-to-t from-mars-rust/10 via-mars-rust/5 to-transparent blur-3xl" />

        {/* Content */}
        <div className="relative z-10 max-w-7xl mx-auto px-6 py-32 text-center">
          {/* Status badge */}
          <div
            className={`inline-flex items-center gap-3 mb-8 transition-all duration-1000 ${isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}
          >
            <div className="relative">
              <div className="w-2 h-2 bg-colony-green rounded-full" />
              <div className="absolute inset-0 w-2 h-2 bg-colony-green rounded-full animate-ping" />
            </div>
            <span className="font-mono text-xs uppercase tracking-widest text-void-300">
              Colony Status: Operational
            </span>
          </div>

          {/* Seal */}
          <div
            className={`relative inline-block mb-8 transition-all duration-1000 delay-100 ${isLoaded ? 'opacity-100 scale-100' : 'opacity-0 scale-90'}`}
          >
            <div className="relative w-32 h-32 md:w-40 md:h-40">
              <Image
                src="/assets/seal.png"
                alt="Martian Republic Seal"
                fill
                className="object-contain drop-shadow-2xl"
                priority
              />
              {/* Rotating glow ring */}
              <div className="absolute inset-[-20%] rounded-full border border-mars-rust/20" style={{ animation: 'rotate 30s linear infinite' }} />
              <div className="absolute inset-[-10%] rounded-full border border-mars-rust/10" style={{ animation: 'rotate 20s linear infinite reverse' }} />
            </div>
          </div>

          {/* Main heading */}
          <h1
            className={`font-display text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-bold tracking-tight mb-6 transition-all duration-1000 delay-200 ${isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}
          >
            <span className="block text-void-100">THE MARTIAN</span>
            <span className="block gradient-text-mars text-glow">REPUBLIC</span>
          </h1>

          {/* Tagline */}
          <p
            className={`max-w-2xl mx-auto text-lg md:text-xl text-void-300 mb-12 leading-relaxed transition-all duration-1000 delay-300 ${isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}
          >
            A decentralized governance system for the first human civilization on Mars.
            <span className="text-void-200"> Powered by blockchain transparency and democratic principles.</span>
          </p>

          {/* CTA Buttons */}
          <div
            className={`flex flex-col sm:flex-row items-center justify-center gap-4 transition-all duration-1000 delay-400 ${isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}
          >
            <Link href="/citizen" className="btn-primary">
              Become a Citizen
            </Link>
            <Link href="/congress" className="btn-secondary">
              Explore Congress
            </Link>
          </div>

          {/* Stats bar */}
          <div
            className={`mt-20 grid grid-cols-2 md:grid-cols-4 gap-8 max-w-3xl mx-auto transition-all duration-1000 delay-500 ${isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}
          >
            {[
              { label: 'Citizens', value: 2847 },
              { label: 'Proposals', value: 156 },
              { label: 'Votes Cast', value: 42891 },
              { label: 'Sol', value: 1247, suffix: '' },
            ].map((stat, i) => (
              <div key={stat.label} className="text-center">
                <div className="font-display text-2xl md:text-3xl font-bold text-void-100 mb-1">
                  <AnimatedCounter end={stat.value} suffix={stat.suffix} />
                </div>
                <div className="font-mono text-xs uppercase tracking-wider text-void-400">
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Scroll indicator */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2">
          <div className="flex flex-col items-center gap-2 text-void-400">
            <span className="font-mono text-xs uppercase tracking-widest">Scroll</span>
            <div className="w-px h-8 bg-gradient-to-b from-void-400 to-transparent" />
          </div>
        </div>
      </section>

      {/* ============================================
          PILLARS SECTION
          ============================================ */}
      <section className="relative py-32 bg-gradient-to-b from-void-900 to-void-800">
        <DataStream />

        <div className="max-w-7xl mx-auto px-6">
          {/* Section header */}
          <div className="mb-16">
            <span className="badge badge-mars mb-4">Foundation</span>
            <h2 className="font-display text-4xl md:text-5xl font-bold text-void-100 mb-4">
              Core Pillars
            </h2>
            <p className="text-lg text-void-300 max-w-2xl">
              The fundamental principles ensuring a fair, transparent, and prosperous future for all Martians.
            </p>
          </div>

          {/* Pillars grid */}
          <div className="grid md:grid-cols-3 gap-12">
            <PillarCard
              index={0}
              icon={
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
              }
              title="Democratic Governance"
              description="Every citizen has an equal voice in the Martian Republic, with the power to propose and vote on legislation that shapes our collective future."
            />
            <PillarCard
              index={1}
              icon={
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M12 11c0 3.517-1.009 6.799-2.753 9.571m-3.44-2.04l.054-.09A13.916 13.916 0 008 11a4 4 0 118 0c0 1.017-.07 2.019-.203 3m-2.118 6.844A21.88 21.88 0 0015.171 17m3.839 1.132c.645-2.266.99-4.659.99-7.132A8 8 0 008 4.07M3 15.364c.64-1.319 1-2.8 1-4.364 0-1.457.39-2.823 1.07-4" />
                </svg>
              }
              title="Blockchain Transparency"
              description="All governance decisions are immutably recorded on the Martian blockchain, ensuring complete transparency and accountability of the public record."
            />
            <PillarCard
              index={2}
              icon={
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
              }
              title="Resource Autonomy"
              description="Our economic systems ensure fair distribution of Martian resources, creating a self-sustaining civilization independent from Earth dependencies."
            />
          </div>
        </div>
      </section>

      {/* ============================================
          MODULES SECTION
          ============================================ */}
      <section className="relative py-32 bg-void-900">
        {/* Background decoration */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-0 left-0 w-1/2 h-px bg-gradient-to-r from-transparent via-mars-rust/30 to-transparent" />
          <div className="absolute bottom-0 right-0 w-1/2 h-px bg-gradient-to-l from-transparent via-colony-cyan/30 to-transparent" />
        </div>

        <div className="max-w-7xl mx-auto px-6">
          {/* Section header */}
          <div className="mb-16 text-center">
            <span className="badge badge-cyan mb-4">Access Points</span>
            <h2 className="font-display text-4xl md:text-5xl font-bold text-void-100 mb-4">
              Republic Modules
            </h2>
            <p className="text-lg text-void-300 max-w-2xl mx-auto">
              Navigate the essential systems of Martian governance and daily life.
            </p>
          </div>

          {/* Cards grid */}
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            <FeatureCard
              href="/wallet"
              index={0}
              badge="Essential"
              icon={
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                </svg>
              }
              title="Martian Wallet"
              description="Manage your identity and digital assets with secure blockchain-based storage."
            />
            <FeatureCard
              href="/citizen"
              index={1}
              icon={
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
              }
              title="Citizen Portal"
              description="Apply for citizenship and access rights and responsibilities of being Martian."
            />
            <FeatureCard
              href="/congress"
              index={2}
              badge="Governance"
              icon={
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                </svg>
              }
              title="Martian Congress"
              description="Participate in democratic governance through proposals and voting."
            />
            <FeatureCard
              href="/feed"
              index={3}
              icon={
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M17 8h2a2 2 0 012 2v6a2 2 0 01-2 2h-2v4l-4-4H9a1.994 1.994 0 01-1.414-.586m0 0L11 14h4a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2v4l.586-.586z" />
                </svg>
              }
              title="Community Feed"
              description="Connect with fellow Martians and stay updated on colony happenings."
            />
            <FeatureCard
              href="/logbook"
              index={4}
              icon={
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
                </svg>
              }
              title="Martian Logbook"
              description="Record and browse activities permanently stored on the blockchain."
            />
            <FeatureCard
              href="/inventory"
              index={5}
              icon={
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                </svg>
              }
              title="Resource Inventory"
              description="Track and manage vital resources ensuring colony sustainability."
            />
            <FeatureCard
              href="/planet"
              index={6}
              badge="Explore"
              icon={
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              }
              title="Planet Map"
              description="Explore Mars geography, settlements, and important locations."
            />
          </div>
        </div>
      </section>

      {/* ============================================
          CTA SECTION
          ============================================ */}
      <section className="relative py-32 overflow-hidden">
        {/* Background */}
        <div className="absolute inset-0 bg-gradient-to-br from-mars-950 via-mars-900 to-mars-oxide" />
        <div className="absolute inset-0 bg-grid-pattern opacity-30" />

        {/* Glowing orb */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-mars-rust/20 rounded-full blur-[150px]" />

        <div className="relative max-w-4xl mx-auto px-6 text-center">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-2 mb-8 bg-white/5 border border-white/10 rounded-full">
            <div className="w-2 h-2 bg-colony-amber rounded-full animate-pulse" />
            <span className="font-mono text-xs uppercase tracking-widest text-void-200">
              Applications Open
            </span>
          </div>

          <h2 className="font-display text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6">
            Join the Martian Republic
          </h2>
          <p className="text-lg md:text-xl text-mars-200 mb-10 max-w-2xl mx-auto leading-relaxed">
            Be part of humanity&apos;s greatest adventure. Create your account and begin your journey to Martian citizenship.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              href="/auth/sign-up"
              className="inline-flex items-center justify-center px-8 py-4 bg-white text-mars-900 font-display font-bold text-sm uppercase tracking-wider transition-all duration-300 hover:bg-mars-100 hover:scale-105 clip-corner-sm"
            >
              Create Account
            </Link>
            <Link
              href="/auth/sign-in"
              className="inline-flex items-center justify-center px-8 py-4 bg-transparent border border-white/30 text-white font-display font-semibold text-sm uppercase tracking-wider transition-all duration-300 hover:bg-white/10 hover:border-white/50 clip-corner-sm"
            >
              Sign In
            </Link>
          </div>

          {/* Trust indicators */}
          <div className="mt-16 flex flex-wrap items-center justify-center gap-8 text-void-300">
            <div className="flex items-center gap-2">
              <svg className="w-5 h-5 text-colony-green" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
              </svg>
              <span className="font-mono text-xs uppercase tracking-wider">Blockchain Secured</span>
            </div>
            <div className="flex items-center gap-2">
              <svg className="w-5 h-5 text-colony-cyan" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
              <span className="font-mono text-xs uppercase tracking-wider">Privacy First</span>
            </div>
            <div className="flex items-center gap-2">
              <svg className="w-5 h-5 text-colony-amber" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span className="font-mono text-xs uppercase tracking-wider">IPFS Distributed</span>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
