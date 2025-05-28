"use client";

import { useState } from "react";
import Link from "next/link";

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <nav
      aria-label="Primary navigation"
      className="bg-white text-black px-6 py-4 flex justify-between items-center shadow-md sticky top-0 z-50"
    >
      {/* Logo / Branding */}
      <h1 className="text-[28px] sm:text-3xl font-bold tracking-tight leading-none font-sans transition-transform hover:scale-105 duration-200">
        <Link href="/" className="flex items-center text-blue-600">
          <span className="text-emerald-500">T-</span>
          <span className="text-blue-950">rejected</span>
          <span className="text-yellow-400 font-mono">.dev</span>
        </Link>
      </h1>

      {/* Hamburger Menu Toggle - Mobile Only */}
      <button
        type="button"
        onClick={() => setMenuOpen(!menuOpen)}
        className="sm:hidden p-2 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-600"
        aria-label="Toggle menu"
        aria-expanded={menuOpen}
      >
        <svg
          className="w-6 h-6 text-blue-600"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          viewBox="0 0 24 24"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          {menuOpen ? (
            <path d="M6 18L18 6M6 6l12 12" />
          ) : (
            <path d="M3 12h18M3 6h18M3 18h18" />
          )}
        </svg>
      </button>

      {/* Navigation Links */}
      <ul
        className={`flex flex-col sm:flex-row sm:space-x-6 absolute sm:static bg-white sm:bg-transparent top-full left-0 w-full sm:w-auto transition-transform duration-200 ease-in-out shadow-md sm:shadow-none ${
          menuOpen ? "translate-x-0" : "-translate-x-full"
        } sm:translate-x-0 sm:flex`}
      >
        {[
          {label : "About", href: "/about"},
          { label: "Articles", href: "/articles" },
          { label: "Real World Projects", href: "/real-world-projects" },
          { label: "E-Books", href: "/e-books" },
          { label: "Internships", href: "/internships" },
          { label: "Contact", href: "/contact" },
        ].map(({ label, href }) => (
          <li key={href}>
            <Link
              href={href}
              className="block px-4 py-2 hover:text-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-600"
              onClick={() => setMenuOpen(false)}
            >
              {label}
            </Link>
          </li>
        ))}
      </ul>

      {/* Book 1:1 Session Button (hidden on mobile) */}
      <Link
        href="/book-session"
        className="hidden sm:inline-block border border-blue-600 text-blue-600 px-4 py-2 rounded-lg hover:bg-blue-600 hover:text-white transition duration-200 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-600"
      >
        Book 1:1 Session
      </Link>
    </nav>
  );
}
