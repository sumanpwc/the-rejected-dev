'use client';

import React, { useState } from 'react';
import { ArticleType } from '@/types/ArticleType';
import { slugify } from '@/lib/slugify';
import { Copy, Check } from 'lucide-react';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { materialDark } from 'react-syntax-highlighter/dist/esm/styles/prism';

type StructuredRendererProps = {
  article: Pick<ArticleType, 'content' | 'headings' | 'codeBlocks'>;
};

function InlineCodeBlock({
  code,
  language,
  caption,
}: {
  code: string;
  language: string;
  caption?: string;
}) {
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
        style={materialDark}
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
  const { content, headings, codeBlocks } = article;
  const paragraphs = content.split('\n\n').filter(Boolean);

  let hIndex = 0;
  let cIndex = 0;
  const blocks: React.ReactNode[] = [];

  for (let i = 0; i < paragraphs.length; i++) {
    if (hIndex < headings.length) {
      const heading = headings[hIndex];
      blocks.push(
        React.createElement(
          heading.type.toLowerCase(),
          {
            id: slugify(heading.text),
            key: `h-${hIndex}`,
            className: 'mt-10 mb-4 text-xl font-bold',
          },
          heading.text
        )
      );
      hIndex++;
    }

    blocks.push(
      <p key={`p-${i}`} className="mb-4 leading-relaxed text-zinc-800 dark:text-zinc-300">
        {paragraphs[i]}
      </p>
    );

    if ((i + 1) % 3 === 0 && cIndex < codeBlocks.length) {
      const cb = codeBlocks[cIndex];
      blocks.push(
        <InlineCodeBlock
          key={`code-${cIndex}`}
          code={cb.code}
          language={cb.language}
          caption={cb.caption}
        />
      );
      cIndex++;
    }
  }

  return <div className="prose dark:prose-invert max-w-none">{blocks}</div>;
}
