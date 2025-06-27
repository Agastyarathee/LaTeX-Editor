import os
import uuid
import tempfile
import subprocess
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from fastapi.responses import StreamingResponse, JSONResponse, HTMLResponse


# Initialize FastAPI app
app = FastAPI()

# Allow frontend to access backend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_methods=["*"],
    allow_headers=["*"],
)

# Ensure MacTeX path is included (required for pdflatex to work)
os.environ["PATH"] += os.pathsep + "/Library/TeX/texbin"


# Request model
class CompileRequest(BaseModel):
    content: str


@app.post("/compile")
async def compile_latex(request: CompileRequest):
    try:
        # Create temporary directory
        with tempfile.TemporaryDirectory() as tmpdir:
            # Generate .tex file path
            tex_filename = f"{uuid.uuid4()}.tex"
            tex_path = os.path.join(tmpdir, tex_filename)

            # Write content to .tex file
            with open(tex_path, "w") as f:
                f.write(request.content)

            # Compile using pdflatex
            result = subprocess.run(
                ["pdflatex", "-interaction=nonstopmode", tex_filename],
                cwd=tmpdir,
                stdout=subprocess.PIPE,
                stderr=subprocess.PIPE,
                timeout=10,
            )

            pdf_path = tex_path.replace(".tex", ".pdf")

            # Check if compilation succeeded
            if result.returncode != 0 or not os.path.exists(pdf_path):
                return JSONResponse(
                    status_code=500,
                    content={
                        "error": "LaTeX compilation failed.",
                        "log": result.stdout.decode("utf-8") + "\n" + result.stderr.decode("utf-8"),
                    },
                )

            # Return PDF file as a stream
            return StreamingResponse(
                open(pdf_path, "rb"),
                media_type="application/pdf"
            )

    except Exception as e:
        return JSONResponse(status_code=500, content={"error": str(e)})

swiftlatex_html = """
<!DOCTYPE html>
<html>
<head>
    <title>SwiftLaTeX Test</title>
    <script src="https://cdn.jsdelivr.net/gh/SwiftLaTeX/SwiftLaTeX@v20022022/webassembly/PdfTeXEngine.js"></script>
    <style>
        body { font-family: sans-serif; max-width: 800px; margin: 2em auto; }
        #pdf-container { border: 1px solid #ccc; min-height: 500px; margin-top: 20px; }
        button { padding: 10px 15px; background: #4285f4; color: white; border: none; cursor: pointer; }
        .logs { background: #f5f5f5; padding: 15px; margin-top: 20px; font-family: monospace; }
    </style>
</head>
<body>
    <h1>SwiftLaTeX Test</h1>
    <button id="compile-btn">Compile LaTeX</button>
    <div id="pdf-container"></div>
    <div class="logs">
        <strong>Logs:</strong>
        <div id="logs"></div>
    </div>

    <script>
        const engine = new PdfTeXEngine();
        const logsElement = document.getElementById('logs');
        
        const latexContent = `\\\\documentclass{article}
\\\\begin{document}
\\\\section*{SwiftLaTeX Test}
Hello from SwiftLaTeX! This document was compiled in your browser.

\\\\begin{equation}
    e^{i\\\\pi} + 1 = 0
\\\\end{equation}

\\\\begin{tabular}{|c|c|}
\\\\hline
Feature & Status \\\\\\\\
\\\\hline
Compilation & Working! \\\\\\\\
\\\\hline
Rendering & Successful! \\\\\\\\
\\\\hline
\\\\end{tabular}
\\\\end{document}`;

        function addLog(message) {
            logsElement.innerHTML += `<div>${message}</div>`;
            logsElement.scrollTop = logsElement.scrollHeight;
        }

        async function compileLaTeX() {
            try {
                addLog("⏳ Loading engine...");
                await engine.loadEngine();
                
                addLog("📝 Writing main.tex to virtual filesystem...");
                engine.writeMemFSFile("main.tex", latexContent);
                engine.setEngineMainFile("main.tex");
                
                addLog("⚙️ Compiling LaTeX...");
                const result = await engine.compileLaTeX();
                
                if (result.pdf) {
                    addLog("✅ Compilation successful!");
                    const blob = new Blob([result.pdf], { type: 'application/pdf' });
                    const url = URL.createObjectURL(blob);
                    document.getElementById('pdf-container').innerHTML = 
                        `<iframe src="${url}" width="100%" height="500px"></iframe>`;
                } else {
                    addLog("❌ Compilation failed. Check logs above.");
                }
            } catch (error) {
                addLog(`🔥 Error: ${error.message}`);
            }
        }

        document.getElementById('compile-btn').addEventListener('click', compileLaTeX);
    </script>
</body>
</html>
"""

@app.get("/try", response_class=HTMLResponse)
async def swiftlatex_test_endpoint():
    return HTMLResponse(content=swiftlatex_html)
   
