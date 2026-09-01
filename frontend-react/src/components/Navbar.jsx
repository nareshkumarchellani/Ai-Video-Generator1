import { Sparkles } from "lucide-react";

const links = [
  { id: "workspace", title: "Home" },
  { id: "dashboard", title: "Dashboard" },
  { id: "projects", title: "Projects" },
];

export default function Navbar({ page, setPage }) {
  return (
    <nav className="flex items-center justify-between px-10 py-5 border-b border-white/10">

      {/* Logo */}
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl bg-cyan-500 flex items-center justify-center">
          <Sparkles size={20} />
        </div>

        <div>
          <h1 className="text-xl font-bold">Flow AI</h1>
          <p className="text-xs text-gray-400">
            AI Video Generator
          </p>
        </div>
      </div>

      {/* Menu */}
      <div className="hidden md:flex gap-8 text-gray-300">
        {links.map((link) => (
          <button
            key={link.id}
            onClick={() => setPage?.(link.id)}
            className={`transition-colors ${
              page === link.id
                ? "text-cyan-400 font-semibold"
                : "hover:text-white"
            }`}
          >
            {link.title}
          </button>
        ))}
      </div>

      {/* Button */}
      <button
        onClick={() => setPage?.("workspace")}
        className="bg-cyan-500 hover:bg-cyan-400 text-black font-semibold px-5 py-2 rounded-xl transition"
      >
        Get Started
      </button>

    </nav>
  );
}
