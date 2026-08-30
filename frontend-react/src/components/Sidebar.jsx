import {
  LayoutDashboard,
  Video,
  FolderOpen,
  BarChart3,
  Settings,
} from "lucide-react";

const menus = [
  {
    id: "dashboard",
    icon: LayoutDashboard,
    title: "Dashboard",
  },
  {
    id: "workspace",
    icon: Video,
    title: "Create Video",
  },
  {
    id: "projects",
    icon: FolderOpen,
    title: "Projects",
  },
  {
    id: "analytics",
    icon: BarChart3,
    title: "Analytics",
  },
  {
    id: "settings",
    icon: Settings,
    title: "Settings",
  },
];

export default function Sidebar({ page, setPage }) {
  return (
    <div className="h-full flex flex-col justify-between">

      <div>

        <h3 className="text-gray-400 uppercase text-xs mb-5">
          Menu
        </h3>

        <div className="space-y-2">

          {menus.map((item) => {

            const Icon = item.icon;

            return (

              <button
                key={item.id}
                onClick={() => setPage(item.id)}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-300 ${
                  page === item.id
                    ? "bg-cyan-500 text-black font-semibold shadow-lg shadow-cyan-500/30"
                    : "hover:bg-white/10 text-gray-300"
                }`}
              >

                <Icon size={20} />

                <span>{item.title}</span>

              </button>

            );

          })}

        </div>

      </div>

      <div className="bg-cyan-500/10 border border-cyan-500/20 rounded-xl p-4">

        <p className="text-sm text-gray-300">
          Upgrade to Pro 🚀
        </p>

        <button className="mt-3 w-full bg-cyan-500 hover:bg-cyan-400 transition text-black py-2 rounded-lg font-semibold">
          Upgrade
        </button>

      </div>

    </div>
  );
}