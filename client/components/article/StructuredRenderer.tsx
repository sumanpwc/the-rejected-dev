'use client';

import React, { useState } from 'react';
import { ArticleType } from '@/types/ArticleType';
import { slugify } from '@/lib/slugify';
import { Copy, Check } from 'lucide-react';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { oneDark } from 'react-syntax-highlighter/dist/esm/styles/prism';

type StructuredRendererProps = {
  article: Pick<ArticleType, 'headings'>;
};

type CodeBlockProps = {
  code: string;
  language: string;
  caption?: string;
};

function InlineCodeBlock({ code, language, caption }: CodeBlockProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    await navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  return (
    <div className="relative my-6 rounded-xl border bg-zinc-950 text-sm text-white overflow-hidden">
      {caption && (
        <div className="px-4 py-2 border-b border-zinc-800 bg-zinc-900 text-sm font-medium text-zinc-400">
          {caption}
        </div>
      )}
      <button
        className="absolute top-2 right-2 z-10 rounded bg-zinc-800 p-1 hover:bg-zinc-700"
        onClick={handleCopy}
        aria-label="Copy code"
      >
        {copied ? <Check className="h-4 w-4 text-green-400" /> : <Copy className="h-4 w-4" />}
      </button>
      <SyntaxHighlighter
        language={language}
        style={oneDark}
        customStyle={{ margin: 0, padding: '1.5em 1em', background: 'transparent' }}
        showLineNumbers
        wrapLongLines
      >
        {code}
      </SyntaxHighlighter>
    </div>
  );
}

export default function StructuredRenderer({ article }: StructuredRendererProps) {
  const { headings } = article;

  const headingClasses: { h2: string; h3: string } = {
    h2: 'mt-10 mb-4 text-2xl font-semibold text-slate-900 dark:text-slate-100',
    h3: 'mt-8 mb-4 text-xl font-semibold text-blue-600 dark:text-slate-100',
  };

  return (
    <div className="prose dark:prose-invert max-w-none">
      {headings.map((heading, idx) => {
        const Tag = heading.type === 'h3' ? 'h3' : 'h2';

        return (
          <div key={`section-${idx}`}>
            {/* Heading */}
            <Tag
              id={slugify(heading.text)}
              className={headingClasses[heading.type] || headingClasses.h2}
            >
              {heading.text}
            </Tag>

            {/* Essence (Markdown-like paragraph rendering) */}
            {heading.essence
              .split('\n\n')
              .filter(Boolean)
              .map((para: string, i: number) => (
                <p
                  key={`para-${idx}-${i}`}
                  className="mb-4 leading-relaxed text-lg text-zinc-800 dark:text-zinc-300"
                >
                  {para}
                </p>
              ))}

            {/* Inline Code Blocks */}
            {heading.codeBlocks?.map((cb, j) => (
              <InlineCodeBlock
                key={`code-${idx}-${j}`}
                code={cb.code}
                language={cb.language}
                caption={cb.caption}
              />
            ))}

            {/* Optional: Render Images */}
            {heading.images?.map((img, k) => (
              <img
                key={`img-${idx}-${k}`}
                src={img.url}
                alt={img.alt}
                className="my-4 max-w-full rounded-md border"
              />
            ))}
          </div>
        );
      })}
    </div>
  );
}
