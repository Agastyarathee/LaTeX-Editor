import React, { useState } from "react";
import diffMatchPatch from "diff-match-patch";

interface File {
  name: string;
  content: string;
}

interface Snapshot {
  timestamp: string;
  files: File[];
}

interface Props {
  files: File[];
  setFiles: React.Dispatch<React.SetStateAction<File[]>>;
  onCompile: () => void;
  setActiveDiffSnapshot: React.Dispatch<React.SetStateAction<Snapshot | null>>;
}

export const SnapshotHistory: React.FC<Props> = ({ files, setFiles, onCompile }) => {
  const [snapshots, setSnapshots] = useState<Snapshot[]>([]);
  const [diffSnapshot, setDiffSnapshot] = useState<Snapshot | null>(null);
  const [activeTab, setActiveTab] = useState<'history' | 'diff'>('history');

  const takeSnapshot = () => {
    const timestamp = new Date().toLocaleString();
    const snapshot: Snapshot = {
      timestamp,
      files: JSON.parse(JSON.stringify(files)),
    };
    setSnapshots((prev) => [...prev, snapshot]);
  };

  const restoreSnapshot = (index: number) => {
    const snapshot = snapshots[index];
    if (snapshot) {
      const confirmRestore = window.confirm(`Restore Snapshot ${index + 1}?`);
      if (confirmRestore) {
        setFiles(snapshot.files);
        onCompile();
      }
    }
  };

  const downloadSnapshot = (index: number) => {
    const snapshot = snapshots[index];
    snapshot.files.forEach((file) => {
      const blob = new Blob([file.content], { type: "text/plain" });
      const link = document.createElement("a");
      link.href = URL.createObjectURL(blob);
      link.download = file.name;
      link.click();
    });
  };

  const renderUnifiedDiff = (oldStr: string, newStr: string) => {
    const dmp = new diffMatchPatch();
    const diffs = dmp.diff_main(oldStr, newStr);
    dmp.diff_cleanupSemantic(diffs);

    return diffs.map(([op, text], i) => {
      if (op === diffMatchPatch.DIFF_INSERT) {
        return <span key={i} style={{ backgroundColor: '#c6f6d5' }}>{text}</span>; // green
      } else if (op === diffMatchPatch.DIFF_DELETE) {
        return <span key={i} style={{ backgroundColor: '#feb2b2' }}>{text}</span>; // red
      } else {
        return <span key={i}>{text}</span>;
      }
    });
  };

  return (
    <div className="mt-4 max-w-full h-full flex flex-col">
      <h2 className="font-bold mb-2 text-lg">📸 Snapshot Manager</h2>

      <div className="flex gap-2 mb-3">
        <button
          onClick={takeSnapshot}
          className="bg-green-600 text-white px-3 py-1 rounded"
        >
          ➕ Take Snapshot
        </button>
      </div>

      <div className="flex mb-2 space-x-4 text-sm">
        <button
          className={`px-3 py-1 rounded ${activeTab === 'history' ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
          onClick={() => setActiveTab('history')}
        >
          📂 History
        </button>
        <button
          className={`px-3 py-1 rounded ${activeTab === 'diff' ? 'bg-purple-500 text-white' : 'bg-gray-200'}`}
          disabled={!diffSnapshot}
          onClick={() => setActiveTab('diff')}
        >
          🔍 Diff
        </button>
      </div>

      {activeTab === 'history' && (
        <ul className="text-sm space-y-4 overflow-y-auto">
          {snapshots.map((snapshot, index) => (
            <li key={index} className="border p-3 rounded shadow-sm bg-white">
              <div className="flex justify-between items-center">
                <span className="font-mono text-xs text-gray-600">
                  🕓 {snapshot.timestamp}
                </span>
                <div className="flex gap-2">
                  <button
                    onClick={() => restoreSnapshot(index)}
                    className="text-blue-600 underline text-xs"
                  >
                    Restore
                  </button>
                  <button
                    onClick={() => downloadSnapshot(index)}
                    className="text-green-600 underline text-xs"
                  >
                    Download
                  </button>
                  <button
                    onClick={() => {
                      setDiffSnapshot(snapshot);
                      setActiveTab('diff');
                    }}
                    className="text-purple-600 underline text-xs"
                  >
                    View Diff
                  </button>
                </div>
              </div>
            </li>
          ))}
        </ul>
      )}

      {activeTab === 'diff' && diffSnapshot && (
        <div className="bg-gray-100 p-3 rounded overflow-auto flex-1">
          <div className="flex justify-between items-center mb-2">
            <strong className="text-gray-700">
              Diff for Snapshot: {diffSnapshot.timestamp}
            </strong>
            <button
              className="text-sm text-red-600 underline"
              onClick={() => setActiveTab('history')}
            >
              ❌ Close Diff
            </button>
          </div>

          <div className="text-xs">
            <pre className="bg-white p-2 rounded whitespace-pre-wrap overflow-x-auto">
              {renderUnifiedDiff(
                diffSnapshot.files.find(f => f.name === 'main.tex')?.content || '',
                files.find(f => f.name === 'main.tex')?.content || ''
              )}
            </pre>
          </div>
        </div>
      )}
    </div>
  );
};
