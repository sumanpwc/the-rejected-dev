"use client";

import React, { useState } from "react";
import { toast, Toaster } from "sonner";
import { useTheme } from "next-themes";

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });
  const [loading, setLoading] = useState(false);
  const { theme } = useTheme();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);

    try {
      // TODO: Replace with your real email API call (Resend or similar)
      await new Promise((res) => setTimeout(res, 1500));

      toast.success("Message sent successfully!");
      setFormData({ name: "", email: "", subject: "", message: "" });
    } catch (error) {
      toast.error("Failed to send message. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Toaster
        position="top-center"
        richColors
        theme={theme === "dark" ? "dark" : "light"}
      />
      <main className="min-h-screen px-6 py-12 max-w-6xl mx-auto flex flex-col md:flex-row gap-12">
        {/* Left Info Column */}
        <section
          aria-label="Contact Information"
          className="flex-1 space-y-6 text-gray-900 dark:text-gray-100"
        >
          <h1 className="text-4xl md:text-5xl font-bold mb-8">
          Let's <span className="text-blue-600">Connect</span>
          </h1>
          <p className="text-lg max-w-md">
              🚀 I usually respond within 12 hours. I am open for partnerships, internships, and guest content.
            </p>
          <address className="not-italic space-y-4">
            <div>
              <h3 className="font-semibold text-xl">Email</h3>
              <a href="mailto:support@therejected.dev" className="text-blue-600 hover:underline">
                support@therejected.dev
              </a>
            </div>
            <div>
              <h3 className="font-semibold text-xl">Phone</h3>
              <a href="tel:+1234567890" className="text-blue-600 hover:underline">
                +1 (234) 567-890
              </a>
            </div>
            <div>
              <h3 className="font-semibold text-xl">Address</h3>
              <p>123 Tech Street, Innovation City, Earth</p>
            </div>
          </address>

          <div aria-label="Social Proof" className="mt-10 border-t pt-6">
            <p className="text-gray-600 dark:text-gray-400">
              💼 Trusted by 20+ clients across 5 countries.
            </p>
            {/* Placeholder for partner logos */}
            <div className="flex space-x-4 mt-4">
              <div className="w-16 h-10 bg-gray-300 dark:bg-gray-700 rounded-md" />
              <div className="w-16 h-10 bg-gray-300 dark:bg-gray-700 rounded-md" />
              <div className="w-16 h-10 bg-gray-300 dark:bg-gray-700 rounded-md" />
              <div className="w-16 h-10 bg-gray-300 dark:bg-gray-700 rounded-md" />
            </div>
          </div>
        </section>

        {/* Right Form Column */}
        <section aria-label="Contact Form" className="flex-1">
          <form
            onSubmit={handleSubmit}
            className="space-y-6 bg-gray-50 dark:bg-gray-900 p-8 rounded-lg shadow-md"
          >
            <div>
              <label htmlFor="name" className="block font-medium mb-1">
                <span className="text-stone-600">Name</span><span className="text-red-600">*</span>
              </label>
              <input
                type="text"
                id="name"
                name="name"
                required
                value={formData.name}
                onChange={handleChange}
                className="w-full rounded-md border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 p-3 focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
                placeholder="Your full name"
                aria-required="true"
              />
            </div>

            <div>
              <label htmlFor="email" className="block font-medium mb-1">
                <span className="text-stone-600">Email</span><span className="text-red-600">*</span>
              </label>
              <input
                type="email"
                id="email"
                name="email"
                required
                value={formData.email}
                onChange={handleChange}
                className="w-full rounded-md border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 p-3 focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
                placeholder="you@example.com"
                aria-required="true"
              />
            </div>

            <div>
              <label htmlFor="subject" className="block font-medium mb-1">
                <span className="text-stone-600">Subject</span>
              </label>
              <input
                type="text"
                id="subject"
                name="subject"
                value={formData.subject}
                onChange={handleChange}
                className="w-full rounded-md border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 p-3 focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
                placeholder="Subject (optional)"
              />
            </div>

            <div>
              <label htmlFor="message" className="block font-medium mb-1">
                <span className="text-stone-600">Message</span><span className="text-red-600">*</span>
              </label>
              <textarea
                id="message"
                name="message"
                required
                value={formData.message}
                onChange={handleChange}
                rows={5}
                className="w-full rounded-md border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 p-3 focus:outline-none focus:ring-2 focus:ring-blue-500 transition resize-none"
                placeholder="Your message here..."
                aria-required="true"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-blue-600 text-white font-semibold py-3 rounded-md hover:bg-blue-700 disabled:bg-blue-400 transition"
              aria-busy={loading}
            >
              {loading ? "Sending..." : "Send Message"}
            </button>
          </form>
        </section>
      </main>
    </>
  );
}
