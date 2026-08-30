import { useState } from "react";

import Sidebar from "./components/Sidebar";
import Navbar from "./components/Navbar";
import Workspace from "./components/Workspace";
import PreviewPanel from "./components/PreviewPanel";
import Background from "./components/Background";
import Settings from "./components/Settings";

export default function App() {

  const [page, setPage] = useState("workspace");

  const [generation, setGeneration] = useState({
    loading: false,
    progress: 0,
    status: "",
    video: null,
  });

  return (
    <>
      <Background />

      <div className="min-h-screen text-white relative z-10">

        <Navbar />

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
                <Workspace setGeneration={setGeneration} />
              )}

              {page === "settings" && (
                <Settings />
              )}

              {page === "dashboard" && (

                <div>

                  <h1 className="text-4xl font-bold mb-4">
                    Dashboard
                  </h1>

                  <p className="text-gray-400">
                    Welcome to Flow AI Dashboard.
                  </p>

                </div>

              )}

              {page === "projects" && (

                <div>

                  <h1 className="text-4xl font-bold mb-4">
                    Projects
                  </h1>

                  <p className="text-gray-400">
                    Your generated videos will appear here.
                  </p>

                </div>

              )}

              {page === "analytics" && (

                <div>

                  <h1 className="text-4xl font-bold mb-4">
                    Analytics
                  </h1>

                  <p className="text-gray-400">
                    Analytics coming soon...
                  </p>

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