import { ExternalLink, Github } from "lucide-react";

interface Project {
  title: string;
  description: string;
  tech: string[];
  tags: string[];
  github?: string;
  live?: string;
}

export default function ProjectCard({ project }: { project: Project }) {
  return (
    <div className="bg-white text-zinc-900 p-6 rounded-2xl border-2 border-blue-600 shadow-md hover:shadow-lg transition-all duration-300">
      <h2 className="text-2xl font-bold text-amber-400 mb-3 tracking-tight">
        {project.title}
      </h2>

      <p className="text-zinc-950 mb-4">{project.description}</p>

      <div className="flex flex-wrap gap-2 mb-4">
        {project.tech.map((tech, index) => (
          <span
            key={index}
            className="bg-zinc-100 text-green-600 px-3 py-1 text-sm rounded-full font-medium border border-green-400"
          >
            {tech}
          </span>
        ))}
      </div>

      <div className="flex flex-wrap gap-2 mb-4">
        {project.tags.map((tag, index) => (
          <span
            key={index}
            className="text-sm px-3 py-1 border border-blue-600 text-blue-600 rounded-full"
          >
            {tag}
          </span>
        ))}
      </div>

      <div className="flex gap-4 mt-4">
        {project.github && (
          <a
            href={project.github}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 text-sm text-white bg-zinc-800 hover:bg-zinc-700 px-4 py-2 rounded-full transition-colors"
            aria-label={`${project.title} GitHub repository`}
          >
            <Github size={16} /> GitHub
          </a>
        )}
        {project.live && (
          <a
            href={project.live}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 text-sm text-blue-950 bg-yellow-400 hover:bg-yellow-300 px-4 py-2 rounded-full font-semibold transition-colors"
            aria-label={`${project.title} Live demo`}
          >
            <ExternalLink size={16} /> Live
          </a>
        )}
      </div>
    </div>
  );
}
