import React, { useState } from "react";

type File = {
  name: string;
  content: string;
};

type FileTreeProps = {
  files: File[];
  setFiles: React.Dispatch<React.SetStateAction<File[]>>;
  selectedFile: string;
  setSelectedFile: React.Dispatch<React.SetStateAction<string>>;
  dark: boolean; 
};

export const FileTree: React.FC<FileTreeProps> = ({
  files,
  setFiles,
  selectedFile,
  setSelectedFile,
  dark
}) => {
  const addFile = () => {
    const name = prompt("Enter new file name (with .tex):", `untitled${files.length + 1}.tex`);
    if (name && !files.some(f => f.name === name)) {
      setFiles([...files, { name, content: "" }]);
      setSelectedFile(name);
    } else if (name) {
      alert("File name already exists.");
    }
  };

  const deleteFile = (index: number) => {
    if (files.length === 1) return alert("You must have at least one file.");
    const confirmDelete = window.confirm(`Delete ${files[index].name}?`);
    if (confirmDelete) {
      const newFiles = files.filter((_, i) => i !== index);
      setFiles(newFiles);
      if (files[index].name === selectedFile) {
        setSelectedFile(newFiles[0].name);
      }
    }
  };

  const renameFile = (index: number) => {
    const newName = prompt("Enter new name (with .tex):", files[index].name);
    if (!newName || newName === files[index].name) return;

    if (files.some(f => f.name === newName)) {
      alert("File name already exists.");
      return;
    }

    const updatedFiles = files.map((file, i) =>
      i === index ? { ...file, name: newName } : file
    );
    setFiles(updatedFiles);
    if (selectedFile === files[index].name) {
      setSelectedFile(newName);
    }
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "12px", fontSize: "15px" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <h3 style={{ margin: 0, fontSize: "16px", fontWeight: "bold" }}>📁 Files</h3>
        <button
          onClick={addFile}
          style={{
            fontSize: "16px",
            padding: "4px 10px",
            borderRadius: "4px",
            border: "none",
            cursor: "pointer",
            backgroundColor: "#e0e0e0",
          }}
          title="Add New File"
        >
          ➕
        </button>
      </div>

      <ul style={{ listStyle: "none", padding: 0, margin: 0, maxHeight: "65vh", overflowY: "auto" }}>
        {files.map((file, index) => {
          const isSelected = selectedFile === file.name;
          const backgroundColor = isSelected ? (dark ? "#0050aa" : "#d0e4ff") : "transparent";
          const textColor = isSelected ? (dark ? "#ffffff" : "#000000") : (dark ? "#eaeaea" : "#222");

          return (
            <li
              key={index}
              style={{
                padding: "8px 10px",
                marginBottom: "4px",
                backgroundColor,
                borderRadius: "6px",
                display: "flex",
                justifyContent: "start",
                alignItems: "center",
                gap: "6px",
                cursor: "pointer",
                fontWeight: isSelected ? "bold" : "normal",
                color: textColor,
              }}
              onClick={() => setSelectedFile(file.name)}
            >
              <span style={{ flexGrow: 1 }}>{file.name}</span>
              <div style={{ display: "flex", gap: "2px" }}>
                <button
                  onClick={(e) => { e.stopPropagation(); renameFile(index); }}
                  style={{
                    background: "none",
                    border: "none",
                    cursor: "pointer",
                    fontSize: "14px",
                  }}
                  title="Rename"
                >
                  ✏️
                </button>
                <button
                  onClick={(e) => { e.stopPropagation(); deleteFile(index); }}
                  style={{
                    background: "none",
                    border: "none",
                    cursor: "pointer",
                    fontSize: "14px",
                  }}
                  title="Delete"
                >
                  🗑️
                </button>
              </div>
            </li>
          );
        })}
      </ul>
    </div>
  );
};
