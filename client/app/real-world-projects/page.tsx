"use client";

import { useState } from "react";
import { Code, FolderOpen, Filter } from "lucide-react";
import ProjectCard from "@/components/card/ProjectCard";

interface Project {
  title: string;
  description: string;
  tech: string[];
  tags: string[];
  github?: string;
  live?: string;
}

const allProjects: Project[] = [
  {
    title: "SwiftCart E-commerce Platform",
    description:
      "A scalable, microservices-based e-commerce platform using Spring Boot, Kafka, Docker, and MongoDB.",
    tech: ["Java", "Spring Boot", "Kafka", "MongoDB", "Docker"],
    tags: ["Enterprise", "Microservices", "Open Source"],
    github: "https://github.com/yourprofile/swiftcart",
    live: "#",
  },
  {
    title: "AI Resume Screener",
    description:
      "A Python-based ML model that analyzes and ranks resumes using NLP and Scikit-learn.",
    tech: ["Python", "NLP", "Scikit-learn"],
    tags: ["AI/ML", "Resume", "Open Source"],
    github: "https://github.com/yourprofile/ai-resume-screener",
    live: "#",
  },
  {
    title: "CloudWatch DevOps Dashboard",
    description:
      "A real-time monitoring dashboard for AWS services integrated with CloudWatch and Docker.",
    tech: ["AWS", "CloudWatch", "Docker", "Node.js"],
    tags: ["Cloud", "DevOps", "Client Work"],
    github: "https://github.com/yourprofile/cloudwatch-dashboard",
    live: "#",
  },
  // Add more projects as needed
];

const categories = ["All", "Java", "Cloud", "AI/ML", "DevOps", "Design"];

export default function ProjectsPage() {
  const [filter, setFilter] = useState("All");

  const filteredProjects =
    filter === "All"
      ? allProjects
      : allProjects.filter((project) => project.tech.includes(filter));

  return (
    <div className="max-w-7xl mx-auto px-6 py-16">
      <section className="text-center mb-14 px-4">
        <div className="flex justify-center items-center gap-3 mb-4 text-green-600 dark:text-green-400">
          <FolderOpen className="w-8 h-8" />
          <Code className="w-8 h-8" />
        </div>

        <h1 className="text-4xl md:text-5xl font-bold text-green-600 dark:text-green-400 tracking-tight leading-tight">
          <span className="text-blue-950">Real World</span>
          <span className="text-yellow-400 font-mono"> Projects</span>
        </h1>
        <p className="mt-4 text-lg text-zinc-600 dark:text-zinc-300 max-w-2xl mx-auto">
          Explore production-grade software projects built using Java, Cloud,
          AI, and DevOps technologies. Designed for portfolio impact, client
          delivery, and open-source contribution.
        </p>
      </section>

      {/* Filter Buttons */}
      <div className="flex flex-wrap justify-center gap-4 mb-10">
        {categories.map((category) => (
          <button
            key={category}
            onClick={() => setFilter(category)}
            className={`px-4 py-2 text-sm rounded-full border transition-all ${
              filter === category
                ? "bg-green-600 text-white border-green-600"
                : "bg-zinc-100 dark:bg-zinc-800 text-zinc-800 dark:text-zinc-200 border-zinc-300 dark:border-zinc-700 hover:bg-zinc-200 dark:hover:bg-zinc-700"
            }`}
            aria-pressed={filter === category}
          >
            {category}
          </button>
        ))}
      </div>

      {/* Project Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-10 lg:w-[90%] mx-auto">
        {filteredProjects.map((project, idx) => (
          <ProjectCard key={idx} project={project} />
        ))}
      </div>
    </div>
  );
}