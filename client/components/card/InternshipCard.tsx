"use client";

import Link from "next/link";

interface Internship {
  title: string;
  tech: string[];
  duration: string;
  closedBy: string;
  applyLink: string;
  jobDescription: string;
  vacancy: number;
  stipend: string;
  keyResponsibilities: string[];
}

export default function InternshipCard({ intern }: { intern: Internship }) {
  const isVacancyOpen = intern.vacancy > 0;

  return (
    <div className="max-w-full rounded-xl border-2 border-blue-600 bg-white p-6 shadow-sm hover:shadow-md transition-shadow duration-300">
      <h2 className="text-2xl font-bold text-black mb-3 tracking-tight">
        {intern.title}
      </h2>

      <p className="text-zinc-700 mb-4">{intern.jobDescription}</p>

      <div className="mb-4 flex flex-wrap gap-2">
        {intern.tech.map((tech, i) => (
          <span
            key={i}
            className="bg-zinc-100 text-green-600 px-3 py-1 text-sm rounded-full font-medium border border-green-400"
          >
            {tech}
          </span>
        ))}
      </div>

      <div className="mb-4 grid grid-cols-2 gap-4 text-sm text-zinc-700">
        <div>
          <span className="font-semibold text-black">Vacancy:</span> {intern.vacancy}
        </div>
        <div>
          <span className="font-semibold text-black">Duration:</span> {intern.duration}
        </div>
        <div>
          <span className="font-semibold text-black">Stipend:</span> {intern.stipend}
        </div>
        <div>
          <span className="font-semibold text-black">Application Deadline:</span> {intern.closedBy}
        </div>
      </div>

      <div className="mb-4">
        <span className="font-semibold text-black">Key Responsibilities:</span>
        <ul className="list-disc list-inside mt-1 text-zinc-700">
          {intern.keyResponsibilities.map((resp, i) => (
            <li key={i}>{resp}</li>
          ))}
        </ul>
      </div>

      <div className="mt-4 flex">
        {isVacancyOpen ? (
          <Link
            href={`/apply/${encodeURIComponent(
              intern.title.toLowerCase().replace(/\s+/g, "-")
            )}`}
            target="_blank"
            rel="noopener noreferrer"
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-full font-semibold transition-colors duration-200"
          >
            Apply Now →
          </Link>
        ) : (
          <button
            disabled
            className="bg-zinc-400 text-white px-6 py-3 rounded-full font-semibold opacity-70 cursor-not-allowed"
          >
            Applications Closed
          </button>
        )}
      </div>
    </div>
  );
}
