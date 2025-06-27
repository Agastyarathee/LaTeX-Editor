import React, { useState, useEffect } from "react";
import Split from "react-split";
import { Editor } from "./components/Editor";
import { PDFPreview } from "./components/PDFPreview";
import { FileTree } from "./components/FileTree";
import { SnapshotHistory } from "./components/SnapshotHistory";
import { Sun, Moon, Bold, Italic, Underline, Sigma, List } from "lucide-react";


const initialFiles = [
  {
    name: "main.tex",
    content: `\\documentclass{article}
\\begin{document}
Hello, world!
\\end{document}`,
  },
];

type File = {
  name: string;
  content: string;
};

type Snapshot = {
  timestamp: string;
  files: File[];
};

type ThemeToggleProps = {
  dark: boolean;
  setDark: React.Dispatch<React.SetStateAction<boolean>>;
};

function ThemeToggle({ dark, setDark }: ThemeToggleProps) {
  return (
    <button
      onClick={() => setDark(!dark)}
      style={{
        padding: "8px",
        borderRadius: "8px",
        backgroundColor: dark ? "#444" : "#ddd",
        border: "none",
        cursor: "pointer",
      }}
      title="Toggle Theme"
    >
      {dark ? <Sun color="orange" size={18} /> : <Moon color="blue" size={18} />}
    </button>
  );
}

export default function App() {
  const [files, setFiles] = useState(initialFiles);
  const [selectedFile, setSelectedFile] = useState("main.tex");
  const [pdfUrl, setPdfUrl] = useState("");
  const [dark, setDark] = useState(
    localStorage.getItem("theme") === "dark" ||
      (!localStorage.getItem("theme") &&
        window.matchMedia("(prefers-color-scheme: dark)").matches)
  );
  const [activeDiffSnapshot, setActiveDiffSnapshot] = useState<Snapshot | null>(null);

  useEffect(() => {
    const root = window.document.documentElement;
    root.style.backgroundColor = dark ? "#121212" : "#f4f4f4";
    localStorage.setItem("theme", dark ? "dark" : "light");
  }, [dark]);

  const insertAtCursor = (text: string) => {
    const file = files.find(f => f.name === selectedFile);
    if (!file) return;
    const textarea = document.querySelector("textarea");
    if (!textarea) return;

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const before = file.content.substring(0, start);
    const after = file.content.substring(end);
    const newContent = before + text + after;

    setFiles(prev =>
      prev.map(f => f.name === selectedFile ? { ...f, content: newContent } : f)
    );
  };

  const handleCompile = async () => {
    const mainFile = files.find((f) => f.name === "main.tex");
    if (!mainFile) {
      alert("main.tex not found");
      return;
    }

    try {
      const response = await fetch("http://localhost:8000/compile", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ content: mainFile.content }),
      });

      if (response.ok) {
        const blob = await response.blob();
        const url = URL.createObjectURL(blob);
        setPdfUrl(url);
      } else {
        const errorData = await response.json();
        alert(`❌ LaTeX Compilation Failed:\n\n${errorData.error}`);
      }
    } catch (error) {
      alert("⚠️ Error communicating with backend.");
      console.error(error);
    }
  };

  const handleDownload = () => {
    if (!pdfUrl) return;
    const link = document.createElement("a");
    link.href = pdfUrl;
    link.download = "output.pdf";
    link.click();
  };

  const panelStyle = {
    backgroundColor: dark ? "#1f1f1f" : "#ffffff",
    color: dark ? "#eaeaea" : "#222",
    borderRadius: "12px",
    padding: "10px",
    height: "100%",
    overflow: "auto",
    boxShadow: dark ? "0 0 12px #0ff2" : "0 0 12px #00f2",
  };

  const headerStyle = {
    padding: "20px",
    backgroundColor: dark ? "#232323" : "#ffffff",
    color: dark ? "#fff" : "#333",
    borderBottom: `1px solid ${dark ? "#333" : "#ccc"}`,
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    width: "100%",
    position: "sticky" as const,
    top: 0,
    zIndex: 1000,
  };

  const toolbarStyle = {
    padding: "10px",
    display: "flex",
    gap: "10px",
    justifyContent: "center",
    backgroundColor: dark ? "#181818" : "#eee",
    borderBottom: `1px solid ${dark ? "#333" : "#ccc"}`,
  };

  return (
    <div style={{ height: "100vh", display: "flex", flexDirection: "column", fontFamily: "Helvetica, sans-serif" }}>
      <header style={headerStyle}>
        
        <div>
          <h1 style={{ fontSize: "28px", fontWeight: "bold", margin: 0 }}>📝 LaTeX Editor</h1>
        </div>
        <ThemeToggle dark={dark} setDark={setDark} />
      </header>
      

      <div style={toolbarStyle}>
        <button onClick={() => insertAtCursor("\\textbf{}")}>Bold</button>
        <button onClick={() => insertAtCursor("\\textit{}")}>Italic</button>
        <button onClick={() => insertAtCursor("\\underline{}")}>Underline</button>
        <button onClick={() => insertAtCursor("$...$")}>Math</button>
        <button onClick={() => insertAtCursor("\\begin{itemize}\n  \\item ...\n\\end{itemize}")}>List</button>
      </div>

      <div style={{ flex: 1, display: "flex", flexDirection: "row" }}>
        <Split
          sizes={[20, 60, 20]}
          minSize={100}
          gutterSize={6}
          style={{ display: "flex", width: "100%" }}
        >
          <div style={panelStyle}>
            <FileTree
              files={files}
              setFiles={setFiles}
              selectedFile={selectedFile}
              setSelectedFile={setSelectedFile}
              dark={dark}
            />
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: "12px", padding: "12px" }}>
            <div style={{ display: "flex", flexDirection: "row", gap: "12px", height: "50%" }}>
              <div style={{ flex: 1, ...panelStyle }}>
                <Editor
                  file={files.find((f) => f.name === selectedFile)}
                  setFileContent={(newContent) =>
                    setFiles((prev) =>
                      prev.map((f) =>
                        f.name === selectedFile ? { ...f, content: newContent } : f
                      )
                    )
                  }
                  dark={dark}
                />
              </div>
              <div style={{ flex: 1, ...panelStyle }}>
                <PDFPreview pdfUrl={pdfUrl} dark={dark} />
              </div>
            </div>
            <div style={{ display: "flex", justifyContent: "center", gap: "10px" }}>
              <button
                onClick={handleCompile}
                style={{
                  backgroundColor: "#007bff",
                  color: "white",
                  border: "none",
                  padding: "10px 16px",
                  borderRadius: "6px",
                  cursor: "pointer",
                  fontWeight: "bold",
                }}
              >
                🚀 Compile to PDF
              </button>
              {pdfUrl && (
                <button
                  onClick={handleDownload}
                  style={{
                    backgroundColor: "#28a745",
                    color: "white",
                    border: "none",
                    padding: "10px 16px",
                    borderRadius: "6px",
                    cursor: "pointer",
                    fontWeight: "bold",
                  }}
                >
                  📥 Download PDF
                </button>
              )}
            </div>
          </div>

          <div style={panelStyle}>
            <SnapshotHistory
              files={files}
              setFiles={setFiles}
              onCompile={handleCompile}
              setActiveDiffSnapshot={setActiveDiffSnapshot}
            />
          </div>
        </Split>
      </div>
    </div>
  );
}
