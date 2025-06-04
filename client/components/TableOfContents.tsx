'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import clsx from 'clsx';
import { Heading } from '@/types/ArticleType'; // Heading = { _id: string; text: string; type: 'H2' | 'H3' }
import { slugify } from '@/lib/slugify';

interface TOCProps {
  headings: Heading[];
}

export default function TableOfContents({ headings }: TOCProps) {
  const [activeId, setActiveId] = useState<string | null>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      entries => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            setActiveId(entry.target.id);
            break;
          }
        }
      },
      {
        rootMargin: '0px 0px -60% 0px',
        threshold: 0.1,
      }
    );

    const elements = headings.map(h =>
      document.getElementById(slugify(h.text))
    );

    elements.forEach(el => {
      if (el) observer.observe(el);
    });

    return () => {
      elements.forEach(el => {
        if (el) observer.unobserve(el);
      });
    };
  }, [headings]);

  if (!headings.length) return null;

  return (
    <aside className="sticky top-24 max-h-[80vh] overflow-y-auto px-4 py-2 text-sm text-zinc-700 dark:text-zinc-300">
      <h3 className="mb-3 text-xs font-bold uppercase tracking-wide text-zinc-500">
        On this page
      </h3>
      <ul className="space-y-2">
        {headings.map(heading => {
          const id = slugify(heading.text);
          const isActive = activeId === id;

          return (
            <li
              key={heading._id}
              className={clsx('transition-colors', {
                'text-blue-600 dark:text-blue-400 font-semibold': isActive,
                'pl-4': heading.type === 'H3',
              })}
            >
              <Link href={`#${id}`} className="hover:underline">
                {heading.text}
              </Link>
            </li>
          );
        })}
      </ul>
    </aside>
  );
}
