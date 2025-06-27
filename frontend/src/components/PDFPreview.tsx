import React from "react";

interface Props {
  pdfUrl: string;
  dark: boolean;
}

export const PDFPreview: React.FC<Props> = ({ pdfUrl, dark }) => {
  const headerBg = dark ? "#1f1f1f" : "#f0f0f0";
  const borderColor = dark ? "#444" : "#ccc";
  const textColor = dark ? "#ccc" : "#888";

  return (
    <div
      style={{
        height: "100%",
        borderRadius: "8px",
        border: `1px solid ${borderColor}`,
        display: "flex",
        flexDirection: "column",
        overflow: "hidden",
        backgroundColor: dark ? "#121212" : "#fff",
        color: dark ? "#eaeaea" : "#222",
      }}
    >
      <h2
        style={{
          fontWeight: "bold",
          padding: "10px",
          margin: 0,
          borderBottom: `1px solid ${borderColor}`,
          backgroundColor: headerBg,
        }}
      >
        PDF Preview
      </h2>

      {pdfUrl ? (
        <iframe
          src={pdfUrl}
          title="PDF Preview"
          style={{ flex: 1, width: "100%", border: "none" }}
        />
      ) : (
        <div style={{ padding: "16px", color: textColor, textAlign: "center", fontStyle: "italic" }}>
          📄 No PDF generated yet.
        </div>
      )}
    </div>
  );
};
