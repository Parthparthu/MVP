"use client";

import Editor from "@monaco-editor/react";

interface Props {
  value: string;
  onChange: (value: string) => void;
}

export default function CodeEditor({ value, onChange }: Props) {
  return (
    <Editor
      height="420px"
      defaultLanguage="python"
      theme="vs-dark"
      value={value}
      onChange={(v) => onChange(v || "")}
      options={{ minimap: { enabled: false }, fontSize: 14 }}
    />
  );
}
