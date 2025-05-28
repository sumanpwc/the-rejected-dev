"use client";

import { Award, Target, Users } from "lucide-react";
import { motion } from 'framer-motion';
import Image from 'next/image';

export default function AboutPage() {
  return (
    <main className="bg-white dark:bg-[#0F172A] text-[#1E293B] dark:text-zinc-100">
      
      {/* Professional Hero Header - Tailwind Only */}
      <section
      className="relative bg-gradient-to-br from-[#0F172A] to-[#1E293B] text-white overflow-hidden"
      aria-label="Hero section of therejected.dev homepage"
      >
      {/* Decorative Grid Overlay */}
      <div
        className="absolute inset-0 opacity-10 bg-[url('/grid.svg')] bg-cover bg-center pointer-events-none"
        role="presentation"
      />

      {/* Subtle Floating Icons */}
      <motion.div
        className="absolute top-0 left-0 w-full h-full z-0 pointer-events-none"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1, delay: 0.4 }}
        aria-hidden="true"
      >
        <div className="absolute left-10 top-24 text-[#2563EB] text-2xl animate-bounce">💻</div>
        <div className="absolute right-14 bottom-20 text-[#22C55E] text-2xl animate-pulse">🚀</div>
        <div className="absolute left-1/2 top-1/3 text-[#FACC15] text-2xl animate-bounce">⚙️</div>
      </motion.div>

      <div className="relative z-10 max-w-7xl mx-auto px-6 py-28 md:flex md:items-center md:justify-between">
        {/* Left Content */}
        <motion.div
          initial={{ opacity: 0, x: -40 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.7, ease: 'easeOut' }}
          className="md:w-2/3"
        >
          {/* Tagline Badge */}
          <div className="inline-block mb-4 px-3 py-1 text-sm rounded-full bg-yellow-500/30 text-yellow-500 font-medium">
            Built Different.
          </div>

          {/* Main Heading */}
          <h1 className="text-4xl sm:text-5xl font-extrabold leading-tight tracking-tight">
            From <span className="text-yellow-400 font-mono">Rejections</span> to <span className="text-emerald-500">Revolution</span>
          </h1>

          {/* Sub Text */}
          <p className="mt-6 text-lg text-zinc-300 max-w-2xl">
            I’m <span className="text-white font-semibold">Suman Das</span>, founder of{' '}
            <span className="text-[#2563EB] font-semibold">therejected.dev</span> — where rejection sparks innovation,
            mentorship builds legacy, and we craft engineering for Fortune 500 standards.
          </p>

          {/* CTA Buttons */}
          <div className="mt-8 flex flex-wrap gap-4">
            <a
              href="/real-world-projects"
              aria-label="Navigate to real-world projects section"
              className="inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-[#2563EB] hover:bg-blue-600 transition-all duration-300 ease-out text-sm font-semibold shadow-md"
            >
              🚧 View Projects
            </a>
            <a
              href="/internships"
              aria-label="Apply for internship opportunity"
              className="inline-flex items-center gap-2 px-5 py-3 rounded-xl border border-white text-white hover:bg-white hover:text-[#0F172A] transition-all duration-300 ease-out text-sm font-semibold"
            >
              🎓 Apply for Internship
            </a>
          </div>
        </motion.div>

        {/* Right: Avatar with Tag */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="mt-12 md:mt-0 md:w-1/3 flex justify-center md:justify-end"
        >
          <div className="relative group">
            <Image
              src="/avatar.png"
              alt="Founder Avatar"
              width={170}
              height={170}
              priority
              placeholder="blur"
              blurDataURL="/avatar-blur.png"
              className="rounded-full border-4 border-[#2563EB] shadow-xl group-hover:scale-105 group-hover:rotate-1 transition-transform duration-300"
            />
            <div className="absolute -bottom-3 left-1/2 -translate-x-1/2 transform bg-[#2563EB] px-3 py-1 text-xs rounded-full text-white shadow-md">
              Founder
            </div>
          </div>
        </motion.div>
      </div>

      {/* Scroll Down Indicator */}
      <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2 text-white opacity-70 animate-bounce text-xl" aria-hidden="true">
        ↓
      </div>
    </section>

      {/* Who We Are */}
      <section className="py-16 px-6 text-center">
        <h2 className="text-3xl font-bold mb-6">Who We Are</h2>
        <p className="max-w-3xl mx-auto text-lg text-zinc-600 dark:text-zinc-300">
          We’re a mission-driven platform helping developers become industry-ready through real-world project building, deployments, and interview-prep that aligns with global enterprise hiring standards.
        </p>
      </section>

      {/* Core Pillars */}
      <section className="py-16 px-6 bg-[#F8FAFC] dark:bg-[#0F172A]">
        <div className="text-center mb-10">
          <h2 className="text-3xl font-bold text-[#1E293B] dark:text-[#FACC15]">Our Core Pillars</h2>
          <p className="text-zinc-600 dark:text-zinc-300">What we believe and how we build</p>
        </div>
        <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto text-left">
          <div className="bg-white dark:bg-zinc-800 p-6 rounded-xl border border-zinc-200 dark:border-zinc-700 shadow-sm">
            <Target className="text-[#2563EB] dark:text-[#FACC15] mb-4" size={32} />
            <h3 className="font-bold text-xl mb-2">Real-World Readiness</h3>
            <p className="text-zinc-600 dark:text-zinc-300">
              Our programs reflect actual dev team environments with Git, CI/CD, Docker, APIs, and documentation.
            </p>
          </div>
          <div className="bg-white dark:bg-zinc-800 p-6 rounded-xl border border-zinc-200 dark:border-zinc-700 shadow-sm">
            <Award className="text-[#2563EB] dark:text-[#FACC15] mb-4" size={32} />
            <h3 className="font-bold text-xl mb-2">Enterprise Standards</h3>
            <p className="text-zinc-600 dark:text-zinc-300">
              We code like the pros: modular design, clean architecture, security-first, scalable systems.
            </p>
          </div>
          <div className="bg-white dark:bg-zinc-800 p-6 rounded-xl border border-zinc-200 dark:border-zinc-700 shadow-sm">
            <Users className="text-[#2563EB] dark:text-[#FACC15] mb-4" size={32} />
            <h3 className="font-bold text-xl mb-2">Inclusive Ecosystem</h3>
            <p className="text-zinc-600 dark:text-zinc-300">
              Regardless of background, we foster a welcoming space for aspiring developers to thrive.
            </p>
          </div>
        </div>
      </section>
    </main>
  );
}
