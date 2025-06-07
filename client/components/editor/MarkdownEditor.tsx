"use client";

import React from "react";
import dynamic from "next/dynamic";
import ReactMarkdown from "react-markdown";
import MdEditor from "react-markdown-editor-lite";
import "react-markdown-editor-lite/lib/index.css";

// Props
interface MarkdownEditorProps {
  value: string;
  onChange: (val: string) => void;
}

const MarkdownEditor: React.FC<MarkdownEditorProps> = ({ value, onChange }) => {
  return (
    <MdEditor
      value={value}
      style={{ height: "400px" }}
      renderHTML={(text) => <ReactMarkdown>{text}</ReactMarkdown>}
      onChange={({ text }) => onChange(text)}
      config={{
        view: {
          menu: true,
          md: true,
          html: false,
        },
        canView: {
          fullScreen: true,
          hideMenu: true,
          menu: true,
          md: true,
          html: false,
        },
      }}
    />
  );
};

export default MarkdownEditor;
