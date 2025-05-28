"use client";

import Link from "next/link";
import {
  Github,
  Linkedin,
  Youtube,
  Instagram,
  Mail,
  FileText,
  Code2,
  UserRound,
  ChevronUp,
} from "lucide-react";
import { useEffect } from "react";

export default function Footer() {
  // Scroll to top
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // Optional: Prevent hydration mismatch if using system dark mode
  useEffect(() => {
    document.documentElement.classList.add("scroll-smooth");
  }, []);

  return (
    <footer className="bg-[#0F172A] text-white py-10 px-6 relative mt-auto">
      
      <div className="max-w-7xl mx-auto grid grid-cols-1 sm:grid-cols-3 gap-10 items-center text-sm">
        {/* Left: Branding */}
        <div className="text-center sm:text-left">
          <Link
            href="/"
            className="text-3xl font-bold tracking-tight hover:scale-105 transition-transform inline-block"
          >
            <span className="text-emerald-500">T-</span>
            <span className="text-white">rejected</span>
            <span className="text-yellow-400 font-mono">.dev</span>
          </Link>
          <p className="mt-2 text-gray-400">Crafted with 💻 for tech minds.</p>
        </div>

        {/* Center: Site Navigation */}
        <ul className="flex flex-wrap justify-center sm:justify-center gap-x-6 gap-y-2 text-gray-300">
          <li>
            <Link href="/about" className="hover:text-white transition">
              <UserRound className="inline w-4 h-4 mr-1" />
              About
            </Link>
          </li>
          <li>
            <Link href="/contact" className="hover:text-white transition">
              <Mail className="inline w-4 h-4 mr-1" />
              Contact
            </Link>
          </li>
          <li>
            <Link href="/articles" className="hover:text-white transition">
              <FileText className="inline w-4 h-4 mr-1" />
              Article
            </Link>
          </li>
          <li>
            <Link href="/real-world-projects" className="hover:text-white transition">
              <Code2 className="inline w-4 h-4 mr-1" />
              Projects
            </Link>
          </li>
          <li>
            <Link href="/internships" className="hover:text-white transition">
              🧑‍💻 Internships
            </Link>
          </li>
        </ul>

        {/* Right: Socials */}
        <div className="flex flex-col gap-4 items-center sm:items-end">
          {/* Social Icons */}
          <div className="flex gap-4 text-gray-400">
            <a
              href="https://github.com/yourusername"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="GitHub"
              className="hover:text-white transition"
            >
              <Github className="w-5 h-5" />
            </a>
            <a
              href="https://linkedin.com/in/yourprofile"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="LinkedIn"
              className="hover:text-white transition"
            >
              <Linkedin className="w-5 h-5" />
            </a>
            <a
              href="https://youtube.com/@yourchannel"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="YouTube"
              className="hover:text-white transition"
            >
              <Youtube className="w-5 h-5" />
            </a>
            <a
              href="https://instagram.com/yourprofile"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Instagram"
              className="hover:text-white transition"
            >
              <Instagram className="w-5 h-5" />
            </a>
          </div>
        </div>
      </div>

      {/* Newsletter */}
      <div className="mt-6 text-center">
        <p className="text-white-300 mb-2">Stay updated with our tech content 🚀</p>
        <form
          action="https://YOUR-USER.usX.list-manage.com/subscribe/post?u=YOUR_U_ID&amp;id=YOUR_LIST_ID"
          method="post"
          target="_blank"
          noValidate
          className="flex flex-col sm:flex-row justify-center items-center gap-3"
        >
          <input
            type="email"
            name="EMAIL"
            placeholder="you@example.com"
            required
            className="px-4 py-2 rounded-md bg-transparent border border-white text-white placeholder-white focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <button
            type="submit"
            className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition"
          >
            Subscribe
          </button>
        </form>
      </div>

      {/* Copyright */}
      <div className="mt-8 text-center text-xs text-gray-500">
        &copy; {new Date().getFullYear()} Trejected.dev — All rights reserved.
      </div>

      {/* Back to Top */}
      <button
        onClick={scrollToTop}
        className="absolute right-6 bottom-6 bg-slate-600 hover:bg-slate-500 text-white p-2 rounded-full shadow-lg transition"
        aria-label="Back to top"
      >
        <ChevronUp className="w-5 h-5" />
      </button>
    </footer>
  );
}
