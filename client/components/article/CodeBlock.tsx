/*
'use client';

import { useState } from 'react';
import { Copy, Check } from 'lucide-react';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { materialDark } from 'react-syntax-highlighter/dist/esm/styles/prism';

interface CodeBlockProps {
  code: string;
  language: string;
  caption?: string;
}

export function CodeBlock({ code, language, caption }: CodeBlockProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    await navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  return (
    <div className="relative my-6 rounded-xl border bg-zinc-950 text-sm text-white overflow-hidden">
      {caption && (
        <div className="px-4 py-2 border-b border-zinc-800 bg-zinc-900 text-xs font-medium text-zinc-400">
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
*/