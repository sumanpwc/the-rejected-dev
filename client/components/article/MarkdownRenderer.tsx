/*
'use client';

import React from 'react';
import ReactMarkdown from 'react-markdown';
import rehypeRaw from 'rehype-raw';
import rehypeSanitize from 'rehype-sanitize';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import oneDark from 'react-syntax-highlighter/dist/cjs/styles/prism';
import type { Components } from 'react-markdown';

type Props = {
  content: string;
};

const MarkdownRenderer: React.FC<Props> = ({ content }) => {
  const components: Components = {
    code: ((props: any) => {
      const { inline, className, children } = props;
      const match = /language-(\w+)/.exec(className || '');
      const codeString = String(children).trim();

      if (inline) {
        return (
          <code className="rounded bg-muted px-1.5 py-1 font-mono text-sm">
            {codeString}
          </code>
        );
      }

      return (
        <div className="not-prose my-4 overflow-hidden rounded-lg border bg-[#282c34]">
          <SyntaxHighlighter
            language={match?.[1] || 'text'}
            style={oneDark as any}
            PreTag="div"
            customStyle={{
              margin: 0,
              padding: '1rem',
              background: 'transparent',
            }}
          >
            {codeString}
          </SyntaxHighlighter>
        </div>
      );
    }) as Components['code'],
  };

  return (
    <ReactMarkdown
      rehypePlugins={[rehypeRaw, rehypeSanitize]}
      components={components}
    >
      {content}
    </ReactMarkdown>
  );
};

export default MarkdownRenderer;
*/