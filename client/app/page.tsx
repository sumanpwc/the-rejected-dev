"use client";

import Link from "next/link";
import { motion } from 'framer-motion';
import { Rocket, BookOpen, Briefcase } from "lucide-react";

export default function LandingPage() {
  return (
    <main className="bg-white dark:bg-zinc-950 text-zinc-900 dark:text-zinc-100">
      {/* Hero */}
      <section
      className="relative px-6 py-28 text-center bg-gradient-to-br from-blue-950 via-zinc-900 to-black overflow-hidden"
      aria-label="Hero section with platform mission and call to action"
      >
      {/* Decorative floating shapes for subtle animation */}
      <motion.div
        aria-hidden="true"
        className="absolute top-10 left-10 w-24 h-24 bg-yellow-400 rounded-full opacity-20 blur-3xl animate-float"
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.2 }}
        transition={{ duration: 3, repeat: Infinity, repeatType: 'reverse' }}
      />
      <motion.div
        aria-hidden="true"
        className="absolute bottom-16 right-12 w-32 h-32 bg-yellow-400 rounded-full opacity-15 blur-3xl animate-float delay-1000"
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.15 }}
        transition={{ duration: 4, repeat: Infinity, repeatType: 'reverse' }}
      />

      <motion.h1
        className="text-4xl md:text-6xl font-extrabold tracking-tight text-white drop-shadow-lg max-w-4xl mx-auto mb-6"
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
      >
        Build 
        <span className="text-yellow-400 font-mono"> Real Projects. </span> 
        Learn. Get 
        <span className="text-emerald-500"> Hired.</span>
      </motion.h1>

      <motion.p
        className="text-lg md:text-xl text-zinc-300 max-w-3xl mx-auto mb-10 leading-relaxed"
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.3 }}
      >
        Join our mission-driven tech platform offering production-grade Java, Cloud, AI, and DevOps training — powered by real-world projects and internship experience.
      </motion.p>

      <motion.div
        className="flex justify-center gap-6"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.6 }}
      >
        <Link
          href="/real-world-projects"
          className="inline-block px-8 py-3 rounded-full bg-yellow-400 text-blue-950 font-bold text-lg shadow-lg hover:bg-yellow-300 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-yellow-400 transition"
          aria-label="Explore real world projects"
        >
          Explore Projects
        </Link>
        <Link
          href="/internships"
          className="inline-block px-8 py-3 rounded-full border-2 border-yellow-400 text-yellow-400 font-semibold text-lg hover:bg-yellow-400 hover:text-blue-950 shadow-lg focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-yellow-400 transition"
          aria-label="Apply for internship"
        >
          Apply for Internship
        </Link>
      </motion.div>

      {/* Subtle animated arrow hint for scroll */}
      <motion.div
        className="absolute bottom-8 left-1/2 -translate-x-1/2"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ repeat: Infinity, repeatType: 'reverse', duration: 1.5 }}
        aria-hidden="true"
      >
        <svg
          className="w-8 h-8 text-yellow-400 animate-bounce"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          viewBox="0 0 24 24"
        >
          <path d="M12 5v14M19 12l-7 7-7-7" />
        </svg>
      </motion.div>
    </section>

      {/* Platform Benefits */}
      <section className="py-16 px-6 text-center">
        <h2 className="text-3xl font-bold mb-6">What Sets Us Apart</h2>
        <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto text-left">
          <div className="bg-zinc-50 dark:bg-zinc-800 p-6 rounded-xl border border-zinc-200 dark:border-zinc-700">
            <Rocket className="text-yellow-400 mb-4" size={32} />
            <h3 className="font-bold mb-2">Real Production Projects</h3>
            <p className="text-zinc-600 dark:text-zinc-300">
              No to-do apps. Build systems used in real companies, with scalable code and dev workflows.
            </p>
          </div>
          <div className="bg-zinc-50 dark:bg-zinc-800 p-6 rounded-xl border border-zinc-200 dark:border-zinc-700">
            <BookOpen className="text-yellow-400 mb-4" size={32} />
            <h3 className="font-bold mb-2">Enterprise-Level Tech</h3>
            <p className="text-zinc-600 dark:text-zinc-300">
              Learn Java, Cloud, DevOps, and AI as they’re used in MNCs — no shortcuts, just production reality.
            </p>
          </div>
          <div className="bg-zinc-50 dark:bg-zinc-800 p-6 rounded-xl border border-zinc-200 dark:border-zinc-700">
            <Briefcase className="text-yellow-400 mb-4" size={32} />
            <h3 className="font-bold mb-2">Internships That Matter</h3>
            <p className="text-zinc-600 dark:text-zinc-300">
              Complete real tasks, collaborate in sprints, and get a verified experience letter + certificate.
            </p>
          </div>
        </div>
      </section>

      {/* Featured Projects */}
      <section className="py-16 px-6 bg-zinc-100 dark:bg-zinc-900">
        <div className="text-center mb-10">
          <h2 className="text-3xl font-bold text-blue-950 dark:text-yellow-400">Featured Projects</h2>
          <p className="text-zinc-600 dark:text-zinc-300">Production-ready systems built for real-world impact</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {/* Map your ProjectCard component here */}

        </div>
        <div className="mt-8 text-center">
          <Link href="/real-world-projects" className="text-blue-600 dark:text-yellow-400 hover:underline font-semibold">
            View All Projects →
          </Link>
        </div>
      </section>

      {/* Articles */}
      <section className="py-16 px-6">
        <div className="text-center mb-10">
          <h2 className="text-3xl font-bold text-blue-950 dark:text-yellow-400">Latest Articles</h2>
          <p className="text-zinc-600 dark:text-zinc-300">Insights, tutorials, and technical deep-dives</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Map your ArticleCard component here */}
        </div>
        <div className="mt-8 text-center">
          <Link href="/articles" className="text-blue-600 dark:text-yellow-400 hover:underline font-semibold">
            Read All Articles →
          </Link>
        </div>
      </section>

      {/* Internships */}
      <section className="py-16 px-6 bg-gradient-to-r from-zinc-900 to-blue-950 text-white text-center">
        <h2 className="text-3xl font-bold mb-3">Internship Opportunities</h2>
        <p className="max-w-xl mx-auto mb-6 text-zinc-300">
          Apply for impactful internships and earn certification, real-world exposure, and portfolio proof.
        </p>
        <Link href="/internships" className="inline-block bg-yellow-400 text-blue-950 px-6 py-3 rounded-full font-semibold hover:bg-yellow-300 transition">
          See Open Positions →
        </Link>
      </section>

      <section className="bg-[#F8FAFC] dark:bg-[#0F172A] py-24 px-6">
        <div className="max-w-7xl mx-auto text-center">
          <h2 className="text-3xl sm:text-4xl font-extrabold text-[#1E293B] dark:text-white mb-6">
            Intern Testimonials
          </h2>
          <p className="text-zinc-600 dark:text-zinc-300 max-w-2xl mx-auto mb-12">
            Hear from our past interns who gained real-world experience, industry-ready skills, and launched their careers.
          </p>

          <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-3">
            {/* Feedback Card */}
            {[
              {
                name: "Priya Sharma",
                role: "Backend Intern @ SwiftCart",
                tech: ["Spring Boot", "PostgreSQL", "Kafka"],
                img: "/intern1.jpg",
                border: "#2563EB",
                review:
                  "Working on production-level backend systems made me confident in writing clean, scalable code. It was an MNC-like environment with solid mentorship.",
              },
              {
                name: "Aditya Verma",
                role: "AI Intern @ therejected.dev",
                tech: ["NLP", "Transformers", "Python"],
                img: "/intern2.jpg",
                border: "#22C55E",
                review:
                  "From building chatbots to exploring LLMs, the AI internship was deeply hands-on and intellectually stimulating. Easily one of my most valuable learning experiences.",
              },
              {
                name: "Sara Khan",
                role: "DevOps Intern",
                tech: ["Docker", "CI/CD", "AWS"],
                img: "/intern3.jpg",
                border: "#FACC15",
                review:
                  "Setting up pipelines, managing cloud deployments, and using GitHub Actions daily gave me clarity and confidence. I landed a full-time DevOps role afterward.",
              },
            ].map((intern, idx) => (
              <div
                key={idx}
                className="bg-white dark:bg-[#1E293B] rounded-2xl p-6 shadow-md hover:shadow-xl transition border border-zinc-100 dark:border-zinc-700 flex flex-col justify-between"
              >
                {/* Top: Reviewer Info */}
                <div className="flex items-center gap-4 mb-4">
                  <img
                    src={intern.img}
                    alt={intern.name}
                    className={`w-14 h-14 rounded-full border-2`}
                    style={{ borderColor: intern.border }}
                  />
                  <div className="text-left">
                    <p className="font-semibold text-[#0F172A] dark:text-white">
                      {intern.name}
                    </p>
                    <p className="text-sm text-zinc-500 dark:text-zinc-400">{intern.role}</p>
                  </div>
                </div>

                {/* Review */}
                <p className="text-sm text-zinc-700 dark:text-zinc-300 italic mb-4">
                  “{intern.review}”
                </p>

                {/* Tech Tags */}
                <div className="flex flex-wrap gap-2 mt-auto">
                  {intern.tech.map((t, i) => (
                    <span
                      key={i}
                      className="text-xs font-medium bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-300 px-2 py-1 rounded-full"
                    >
                      {t}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
