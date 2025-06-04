"use client";

import { useState } from "react";
import { GraduationCap, Code2 } from "lucide-react";
import InternshipCard from "@/components/card/InternshipCard"; // Adjust path as needed

const internships = [
  {
    title: "Java Development Intern",
    tech: ["Java", "Spring Boot", "REST API"],
    duration: "4 Weeks",
    closedBy: "15-06-2025",
    applyLink: "#",
    jobDescription:
      "Work on backend services with Java and Spring Boot to build RESTful APIs and microservices.",
    vacancy: 5,
    stipend: "₹10,000/month",
    keyResponsibilities: [
      "Writing clean and efficient Java code: This involves implementing new features, modifying existing code, and creating new functionalities.",
      "Collaborating with team members: Working closely with senior developers to design and implement software solutions.",
      "Writing well-documented code: Ensuring that code is easy to understand and maintain.",
      "Performing unit testing: Testing individual components of the code to ensure they function correctly."
    ],
  },
  {
    title: "Cloud & DevOps Intern",
    tech: ["AWS", "Docker", "CI/CD"],
    duration: "6 Weeks",
    closedBy: "15-06-2025",
    applyLink: "#",
    jobDescription:
      "Manage cloud infrastructure, automate deployment pipelines, and monitor system health.",
    vacancy: 4,
    stipend: "₹12,000/month",
    keyResponsibilities: [
      "Setup and manage AWS services",
      "Create CI/CD pipelines",
      "Maintain Docker containers",
    ],
  },
  {
    title: "Ethical Hacking Intern",
    tech: ["Kali Linux", "Nmap", "Burp Suite"],
    duration: "4 Weeks",
    closedBy: "15-06-2025",
    applyLink: "#",
    jobDescription:
      "Perform vulnerability assessments and penetration testing to enhance system security.",
    vacancy: 3,
    stipend: "₹8,000/month",
    keyResponsibilities: [
      "Conduct penetration tests",
      "Analyze network vulnerabilities",
      "Prepare security reports",
    ],
  },
  {
    title: "Web Development Intern",
    tech: ["HTML", "CSS", "JavaScript", "React"],
    duration: "6 Weeks",
    closedBy: "15-06-2025",
    applyLink: "#",
    jobDescription:
      "Build responsive web applications and collaborate with designers to implement UI features.",
    vacancy: 6,
    stipend: "₹10,000/month",
    keyResponsibilities: [
      "Develop React components",
      "Optimize web performance",
      "Work with REST APIs",
    ],
  },
  {
    title: "Web Design Intern",
    tech: ["Figma", "Adobe XD", "Responsive Design"],
    duration: "4 Weeks",
    closedBy: "15-06-2025",
    applyLink: "#",
    jobDescription:
      "Design user-friendly web interfaces and prototypes for various devices.",
    vacancy: 2,
    stipend: "₹7,000/month",
    keyResponsibilities: [
      "Create wireframes and mockups",
      "Collaborate with developers",
      "Ensure responsive design",
    ],
  },
  {
    title: "SEO Expert Intern",
    tech: ["On-Page SEO", "Off-Page SEO", "Google Analytics"],
    duration: "3 Weeks",
    closedBy: "15-06-2025",
    applyLink: "#",
    jobDescription:
      "Optimize website content and structure to improve search engine rankings.",
    vacancy: 3,
    stipend: "₹6,000/month",
    keyResponsibilities: [
      "Conduct keyword research",
      "Analyze website traffic",
      "Develop SEO strategies",
    ],
  },
  {
    title: "Technical Writing Intern",
    tech: ["Markdown", "API Docs", "GitBook"],
    duration: "4 Weeks",
    closedBy: "15-06-2025",
    applyLink: "#",
    jobDescription:
      "Create clear and concise documentation for APIs and software products.",
    vacancy: 2,
    stipend: "₹7,000/month",
    keyResponsibilities: [
      "Write API documentation",
      "Maintain knowledge base",
      "Collaborate with developers",
    ],
  },
  {
    title: "Graphics Design Intern",
    tech: ["Adobe Photoshop", "Illustrator", "Canva"],
    duration: "4 Weeks",
    closedBy: "15-06-2025",
    applyLink: "#",
    jobDescription:
      "Design creative visual content for marketing and social media campaigns.",
    vacancy: 0,
    stipend: "₹7,000/month",
    keyResponsibilities: [
      "Create digital graphics",
      "Design social media posts",
      "Support branding efforts",
    ],
  },
  {
    title: "Video Editing Intern",
    tech: ["Adobe Premiere Pro", "Final Cut Pro", "CapCut"],
    duration: "4 Weeks",
    closedBy: "15-06-2025",
    applyLink: "#",
    jobDescription:
      "Edit and produce engaging videos for online content and promotional materials.",
    vacancy: 2,
    stipend: "₹8,000/month",
    keyResponsibilities: [
      "Edit video footage",
      "Add effects and transitions",
      "Collaborate with content team",
    ],
  },
  {
    title: "Article Writing Intern",
    tech: ["SEO Writing", "Blogging", "WordPress"],
    duration: "3 Weeks",
    closedBy: "15-06-2025",
    applyLink: "#",
    jobDescription:
      "Write SEO-friendly articles and blog posts on technology and software topics.",
    vacancy: 4,
    stipend: "₹6,000/month",
    keyResponsibilities: [
      "Research blog topics",
      "Create SEO optimized content",
      "Publish on WordPress",
    ],
  },
  {
    title: "Content Writing Intern",
    tech: ["Content Strategy", "Copywriting", "Storytelling"],
    duration: "4 Weeks",
    closedBy: "15-06-2025",
    applyLink: "#",
    jobDescription:
      "Develop compelling content strategies and write engaging copy for various channels.",
    vacancy: 3,
    stipend: "₹7,000/month",
    keyResponsibilities: [
      "Create marketing copy",
      "Plan content calendars",
      "Collaborate with design team",
    ],
  },
  {
    title: "AI & ML Intern",
    tech: ["Python", "Scikit-learn", "Pandas", "Jupyter"],
    duration: "6 Weeks",
    closedBy: "15-06-2025",
    applyLink: "#",
    jobDescription:
      "Develop machine learning models and analyze data to solve real-world problems.",
    vacancy: 4,
    stipend: "₹15,000/month",
    keyResponsibilities: [
      "Build ML models",
      "Perform data analysis",
      "Document experiments",
    ],
  },
];


const ITEMS_PER_PAGE = 6;

export default function InternshipsPage() {
  const [currentPage, setCurrentPage] = useState(1);
  const totalPages = Math.ceil(internships.length / ITEMS_PER_PAGE);

  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const currentItems = internships.slice(startIndex, startIndex + ITEMS_PER_PAGE);

  const handlePageChange = (page: number) => {
    if (page > 0 && page <= totalPages) setCurrentPage(page);
  };

  return (
    <div className="max-w-7xl mx-auto px-6 py-16">
      <div className="text-center mb-14">
        <section id="internships" className="text-center mb-14 px-4">
          <div className="flex justify-center items-center gap-3 mb-4 text-red-500 dark:text-blue-400">
            <GraduationCap className="w-8 h-8" />
            <Code2 className="w-8 h-8" />
          </div>

          <h1 className="text-4xl md:text-5xl font-bold text-blue-950 dark:text-blue-950 tracking-tight leading-tight">
           	<span className="text-emerald-500">Intern With Us –</span>
            <span className="text-blue-950"> Build</span>
            <span className="text-yellow-400 font-mono"> Skills</span>
            <span className="text-blue-950"> That</span>
            <span className="text-blue-600 font-mono"> Matter</span>
          </h1>

          <p className="mt-4 text-lg text-zinc-600 dark:text-zinc-300 max-w-2xl mx-auto">
            Gain hands-on experience through industry-focused internship programmes. Collaborate on real-world software projects, grow your portfolio, and earn globally recognised certifications to boost your career in tech.
          </p>
          <a
            href="https://anubrain.com"
            target="_blank"
            rel="noopener noreferrer"
            className="mt-6 md:mt-0 ml-auto text-xl font-bold text-blue-950 hover:underline"
          >
           - Affiliated with AnuBrain Technology
          </a>

        </section>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-1 gap-10 lg:w-[70%] lg:mx-auto">
        {currentItems.map((intern, idx) => (
          <InternshipCard key={idx} intern={intern} />
        ))}
      </div>

      {/* Pagination */}
      <div className="mt-12 flex justify-center items-center gap-2">
        <button
          onClick={() => handlePageChange(currentPage - 1)}
          disabled={currentPage === 1}
          className="px-4 py-2 text-sm rounded-lg bg-zinc-800 text-white hover:bg-zinc-700 disabled:opacity-50"
        >
          ← Prev
        </button>

        {Array.from({ length: totalPages }).map((_, i) => (
          <button
            key={i}
            onClick={() => handlePageChange(i + 1)}
            className={`px-4 py-2 text-sm rounded-lg ${
              currentPage === i + 1
                ? "bg-blue-600 text-white"
                : "bg-zinc-800 text-white hover:bg-zinc-700"
            }`}
          >
            {i + 1}
          </button>
        ))}

        <button
          onClick={() => handlePageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
          className="px-4 py-2 text-sm rounded-lg bg-zinc-800 text-white hover:bg-zinc-700 disabled:opacity-50"
        >
          Next →
        </button>
      </div>
    </div>
  );
}
