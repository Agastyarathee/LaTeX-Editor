
# 📄 Fast Overleaf-Style LaTeX Editor (React + FastAPI + Docker)

> A hybrid system that combines a React-based frontend with a FastAPI backend — balancing in-memory logic for speed and using backend calls only when necessary.  
This powers a **blazing-fast, in-memory LaTeX-to-PDF conversion platform** with real-time LaTeX editing, snapshot versioning, and live PDF preview — 
built entirely from scratch using **React**, **FastAPI**, and **Dockerized TeX Live**. The system supports Overleaf-style editing, rapid compile, responsive layout, and dark/light themes —
all optimized for performance, clarity, and extensibility.
---

## 🚀 Key Features

🔧 **Zero-Latency Compilation**  
- Instant PDF generation using `pdfTeX` via MacTeX (Dockerized for isolation)
- FastAPI backend with clean `/compile` API for PDF serving

🧠 **In-Memory File System & Snapshots**  
- Files stored in browser memory for ultra-fast read/write
- Snapshot versioning with O(1) constant complexity — supports instant restore & comparison
- Zero backend database usage (unless extended) = blazing speed

🧾 **Live PDF Preview + Editor Sync**  
- Write LaTeX → Compile → See PDF preview without reloading
- React-based UI ensures updates are smooth and non-blocking

🧩 **Feature-Rich File Tree**  
- Built using vanilla React & JavaScript
- Add, delete, rename `.tex` files in a real-time nested structure

🕵️ **Real-Time Diff + History Viewer**  
- Save snapshots of file content over time  
- View changes between snapshots using color-coded text diffs (`diff-match-patch`)  
- Restore or download past versions

🌗 **Dark/Light Mode & Responsive UI**  
- Toggle between clean light mode and distraction-free dark mode  
- Drag-resizable layout (via `react-split`) to rearrange panels live

📥 **PDF Download Support**  
- Once compiled, PDFs can be downloaded instantly
- Clean output naming & blob object creation handled client-side

---

## 📦 Tech Stack

### Frontend
- **React + TypeScript**
- **CodeMirror (planned)** for LaTeX syntax highlighting
- `react-pdf` for previewing compiled PDFs
- `diff-match-patch` for real-time file comparison
- `react-split` for resizable layout panels

### Backend
- **FastAPI (Python)** for secure and fast LaTeX compilation
- **MacTeX + pdfTeX** inside a **Docker container** for LaTeX rendering
- Minimal and extendable — currently stateless but can integrate SQLite if needed

---

## 💡 How It Works

1. User edits LaTeX source in a live editor.
2. On "Compile", frontend sends LaTeX content via POST to FastAPI.
3. FastAPI uses `pdfTeX` (from MacTeX) to compile into PDF.
4. PDF is returned as a blob and rendered using `react-pdf`.
5. Users can download PDF, take snapshots, or view diffs from any point in history.

---

## 📂 Project Structure

```
frontend/
├── App.tsx
├── components/
│   ├── Editor.tsx
│   ├── FileTree.tsx
│   ├── PDFPreview.tsx
│   └── SnapshotHistory.tsx
└── styles/

backend/
├── main.py
├── compiler.py
├── Dockerfile
└── requirements.txt
```

---

## 🛠️ Initialization & Setup (via Docker Image)

To get started instantly with the full application, you can download and run the pre-built Docker images directly — no need to clone or build anything.

🔽 **Download Docker Images (Frontend + Backend):**  
[Download LaTeXPlatform.tar](https://1drv.ms/u/c/6ce49fd584ca245e/EZY8c0ddDr1As80kM394fzoBjBFNJqviuhBm3IbsjUkk8g?e=LfDpIp)

Once downloaded, load and run them as follows:


### 1. Load the Docker images

```bash
docker load -i LaTeXPlatform.tar
```

Expected output:

```
Loaded image: backend-backend:latest  
Loaded image: frontend-interface:latest
```

### 2. Start the frontend container

```bash
docker run -d --name front1 -p 5173:5173 frontend-interface
```

### 3. Start the backend container

```bash
docker run -d --name back -p 8000:8000 backend-backend
```

---

Once both containers are running:

📄 **Frontend**: [http://localhost:5173](http://localhost:5173)  
⚙️ **Backend API**: [http://localhost:8000](http://localhost:8000)

---

You'll now see the full SwiftLaTeX interface with:

- ✍️ Real-time LaTeX Editing  
- 📁 File Tree Navigation  
- 📑 Live PDF Preview  
- 🕒 Snapshot Versioning & Diff Viewer  

Everything is in-memory — ensuring lightning-fast compile times and a fluid Overleaf-like experience.

---

## 🌟 What Makes It Special?

- No database or disk dependency — it runs entirely in memory
- O(1) snapshot handling (via simple timestamped file state)
- Smart file diffing (not just full-text comparison)
- Looks clean, works fast, and mimics Overleaf without the clutter

---

## 👨‍💻 Author

**Agastya Rathee**  
Computer Science & Data Science @ UW–Madison  
📧 [ratheeagastya@gmail.com](mailto:ratheeagastya@gmail.com)  
🔗 [GitHub](https://github.com/Agastyarathee)

---

## 🧠 Future Scope

- [ ] Integrate AI-powered `DiffChatEditor` for smarter change insights
- [ ] Real-time collaboration with CRDT/WebSocket layer

---

## 📃 License

MIT License – Free to use, fork, and build upon.

---

> “A fully functional LaTeX IDE in your browser — fast, clean, and memory-based.”
