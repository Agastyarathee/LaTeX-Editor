import React from "react";

type EditorProps = {
  file: { name: string; content: string } | undefined;
  setFileContent: (newContent: string) => void;
  dark: boolean; 
};

export const Editor: React.FC<EditorProps> = ({ file, setFileContent, dark }) => {
  if (!file) return <div>No file selected.</div>;

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setFileContent(e.target.value);
  };

  return (
    <textarea
      value={file.content}
      onChange={handleChange}
      style={{
        width: "100%",
        height: "100%",
        padding: "10px",
        fontFamily: "monospace",
        fontSize: "14px",
        backgroundColor: dark ? "#1e1e1e" : "#fff",
        color: dark ? "#e0e0e0" : "#000",
        border: "none",
        resize: "none",
        outline: "none",
      }}
    />
  );
};
