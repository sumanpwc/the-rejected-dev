"use client";

import React, { useState } from "react";
import { toast, Toaster } from "sonner";
import { useTheme } from "next-themes";

export default function ApplyInternshipClient() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    coverLetter: "",
    resume: null as File | null,
  });

  const [loading, setLoading] = useState(false);
  const { theme } = useTheme();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.[0]) {
      setFormData((prev) => ({ ...prev, resume: e.target.files![0] }));
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!formData.name || !formData.email || !formData.coverLetter || !formData.resume) {
      toast.error("Please fill in all required fields and upload your resume.");
      return;
    }

    setLoading(true);

    try {
      const payload = new FormData();
      payload.append("name", formData.name);
      payload.append("email", formData.email);
      payload.append("coverLetter", formData.coverLetter);
      payload.append("resume", formData.resume);

      await fetch("/api/apply-internship", {
        method: "POST",
        body: payload,
      });

      toast.success("Application submitted successfully!");
      setFormData({ name: "", email: "", coverLetter: "", resume: null });
    } catch (err) {
      toast.error("Failed to submit application. Try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Toaster position="top-center" richColors theme={theme === "dark" ? "dark" : "light"} />
      <div className="min-h-screen flex justify-center items-center px-4 py-12">
        <form
          onSubmit={handleSubmit}
          className="w-full max-w-2xl space-y-6 bg-gray-50 dark:bg-gray-900 p-8 rounded-lg shadow-md"
        >
          <h1 className="text-2xl font-bold mb-4 text-gray-800 dark:text-white">
            Internship Application
          </h1>

          <div>
            <label className="block font-medium mb-1">
              Name <span className="text-red-600">*</span>
            </label>
            <input
              name="name"
              type="text"
              value={formData.name}
              onChange={handleChange}
              required
              className="w-full p-3 rounded-md border dark:border-gray-700 dark:bg-gray-800"
              placeholder="Your name"
            />
          </div>

          <div>
            <label className="block font-medium mb-1">
              Email <span className="text-red-600">*</span>
            </label>
            <input
              name="email"
              type="email"
              value={formData.email}
              onChange={handleChange}
              required
              className="w-full p-3 rounded-md border dark:border-gray-700 dark:bg-gray-800"
              placeholder="you@example.com"
            />
          </div>

          <div>
            <label className="block font-medium mb-1">
              Cover Letter <span className="text-red-600">*</span>
            </label>
            <textarea
              name="coverLetter"
              rows={5}
              value={formData.coverLetter}
              onChange={handleChange}
              required
              className="w-full p-3 rounded-md border dark:border-gray-700 dark:bg-gray-800 resize-none"
              placeholder="Tell us why you're a good fit..."
            />
          </div>

          <div>
            <label className="block font-medium mb-1">
              Resume <span className="text-red-600">*</span>
            </label>
            <input
              type="file"
              accept=".pdf,.doc,.docx"
              onChange={handleFileChange}
              required
              className="w-full p-2 rounded-md border dark:border-gray-700 dark:bg-gray-800"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 text-white font-semibold py-3 rounded-md hover:bg-blue-700 disabled:bg-blue-400 transition"
          >
            {loading ? "Submitting..." : "Submit Application"}
          </button>
        </form>
      </div>
    </>
  );
}
