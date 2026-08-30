import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";

export default function Home() {
  return (
    <div className="bg-zinc-950 text-white min-h-screen">

      <Navbar />

      <div className="flex">

        <Sidebar />

        <main className="flex-1 p-8">

          <h2 className="text-4xl font-bold">
            Welcome to Flow AI
          </h2>

          <p className="text-zinc-400 mt-2">
            Generate cinematic AI videos from prompts.
          </p>

        </main>

      </div>

    </div>
  );
}