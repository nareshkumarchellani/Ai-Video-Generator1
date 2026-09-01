import { useState, useEffect } from "react";

import Sidebar from "./components/Sidebar";
import Navbar from "./components/Navbar";
import Workspace from "./components/Workspace";
import PreviewPanel from "./components/PreviewPanel";
import Background from "./components/Background";
import Settings from "./components/Settings";

const HISTORY_KEY = "flowai_video_history";

export default function App() {

  const [page, setPage] = useState("workspace");

  const [generation, setGeneration] = useState({
    loading: false,
    progress: 0,
    status: "",
    video: null,
  });

  const [history, setHistory] = useState(() => {
    try {
      const saved = localStorage.getItem(HISTORY_KEY);
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem(HISTORY_KEY, JSON.stringify(history));
    } catch {
      // storage full or unavailable — ignore
    }
  }, [history]);

  const addToHistory = (entry) => {
    setHistory((prev) => [
      {
        id: `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
        createdAt: new Date().toISOString(),
        ...entry,
      },
      ...prev,
    ]);
  };

  return (
    <>
      <Background />

      <div className="min-h-screen text-white relative z-10">

        <Navbar page={page} setPage={setPage} />

        <main className="max-w-7xl mx-auto px-8 py-10">

          <div className="grid grid-cols-12 gap-6">

            {/* Sidebar */}

            <aside className="col-span-2 bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-5">

              <Sidebar
                page={page}
                setPage={setPage}
              />

            </aside>

            {/* Main Content */}

            <section className="col-span-7 bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-6">

              {page === "workspace" && (
                <Workspace
                  setGeneration={setGeneration}
                  addToHistory={addToHistory}
                />
              )}

              {page === "settings" && (
                <Settings />
              )}

              {page === "dashboard" && (

                <div className="space-y-6">

                  <h1 className="text-4xl font-bold mb-2">
                    Dashboard
                  </h1>

                  <p className="text-gray-400">
                    Welcome to Flow AI Dashboard.
                  </p>

                  <div className="grid grid-cols-3 gap-5 mt-6">

                    <div className="rounded-2xl bg-white/5 border border-white/10 p-6">
                      <div className="text-gray-400 text-sm mb-2">
                        Videos Generated
                      </div>
                      <div className="text-3xl font-bold text-cyan-400">
                        {history.length}
                      </div>
                    </div>

                    <div className="rounded-2xl bg-white/5 border border-white/10 p-6">
                      <div className="text-gray-400 text-sm mb-2">
                        Most Used Model
                      </div>
                      <div className="text-2xl font-bold">
                        {history.length
                          ? Object.entries(
                              history.reduce((acc, h) => {
                                acc[h.model] = (acc[h.model] || 0) + 1;
                                return acc;
                              }, {})
                            ).sort((a, b) => b[1] - a[1])[0][0]
                          : "—"}
                      </div>
                    </div>

                    <div className="rounded-2xl bg-white/5 border border-white/10 p-6">
                      <div className="text-gray-400 text-sm mb-2">
                        Last Generated
                      </div>
                      <div className="text-lg font-semibold">
                        {history.length
                          ? new Date(history[0].createdAt).toLocaleString()
                          : "—"}
                      </div>
                    </div>

                  </div>

                  {history.length > 0 && (
                    <button
                      onClick={() => setPage("workspace")}
                      className="mt-2 bg-cyan-500 hover:bg-cyan-400 text-black font-semibold px-5 py-2 rounded-xl transition"
                    >
                      + Create Another Video
                    </button>
                  )}

                </div>

              )}

              {page === "projects" && (

                <div className="space-y-6">

                  <h1 className="text-4xl font-bold mb-2">
                    Projects
                  </h1>

                  {history.length === 0 ? (
                    <p className="text-gray-400">
                      Your generated videos will appear here.
                    </p>
                  ) : (
                    <div className="grid grid-cols-2 gap-5">
                      {history.map((item) => (
                        <div
                          key={item.id}
                          className="rounded-2xl bg-white/5 border border-white/10 overflow-hidden"
                        >
                          <div className="aspect-video bg-black">
                            {item.video ? (
                              <video
                                controls
                                className="w-full h-full object-cover"
                                src={item.video}
                              />
                            ) : (
                              <div className="w-full h-full flex items-center justify-center text-gray-500 text-sm">
                                No preview
                              </div>
                            )}
                          </div>
                          <div className="p-4">
                            <p className="text-sm text-gray-300 line-clamp-2">
                              {item.prompt}
                            </p>
                            <div className="flex items-center justify-between mt-2 text-xs text-gray-500">
                              <span>{item.model}</span>
                              <span>
                                {new Date(item.createdAt).toLocaleDateString()}
                              </span>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}

                </div>

              )}

              {page === "analytics" && (

                <div className="space-y-6">

                  <h1 className="text-4xl font-bold mb-2">
                    Analytics
                  </h1>

                  {history.length === 0 ? (
                    <p className="text-gray-400">
                      Generate a few videos to see analytics here.
                    </p>
                  ) : (
                    <div className="space-y-3">
                      <p className="text-gray-400">
                        Breakdown by AI model:
                      </p>
                      {Object.entries(
                        history.reduce((acc, h) => {
                          acc[h.model] = (acc[h.model] || 0) + 1;
                          return acc;
                        }, {})
                      ).map(([model, count]) => (
                        <div key={model} className="flex items-center gap-3">
                          <span className="w-32 text-sm text-gray-300">
                            {model}
                          </span>
                          <div className="flex-1 h-3 rounded-full bg-white/10 overflow-hidden">
                            <div
                              className="h-full bg-cyan-400"
                              style={{
                                width: `${(count / history.length) * 100}%`,
                              }}
                            />
                          </div>
                          <span className="text-sm text-gray-400 w-6 text-right">
                            {count}
                          </span>
                        </div>
                      ))}
                    </div>
                  )}

                </div>

              )}

            </section>

            {/* Preview */}

            <aside className="col-span-3 bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-5">

              <PreviewPanel generation={generation} />

            </aside>

          </div>

        </main>

      </div>

    </>
  );
}