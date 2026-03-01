import { NavLink } from "react-router-dom";
// import { Settings } from "lucide-react";

const base =
  "flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition hover:bg-zinc-900";
const active = "bg-zinc-900 text-white";
const inactive = "text-zinc-400";

export function Sidebar() {
  return (
    <aside className="flex h-screen w-64 flex-col border-r border-zinc-900 p-4">
      <NavLink
        to="/profile"
        className="mb-6 flex items-center gap-3 rounded-lg p-2 transition hover:bg-zinc-900 group"
      >
        <div className="h-8 w-8 overflow-hidden rounded-full bg-zinc-300 ring-2 ring-transparent group-hover:ring-zinc-700 transition"></div>
        <div className="flex flex-col">
          <span className="text-sm font-semibold text-white">Admin</span>
          <span className="text-xs text-zinc-500">View profile</span>
        </div>
      </NavLink>

      <nav className="flex flex-1 flex-col space-y-1">
        <NavLink
          to="/"
          end
          className={({ isActive }) =>
            `${base} ${isActive ? active : inactive}`
          }
        >
          Dashboard
        </NavLink>

        <NavLink
          to="/artists"
          className={({ isActive }) =>
            `${base} ${isActive ? active : inactive}`
          }
        >
          Artists
        </NavLink>

        <NavLink
          to="/tracks"
          className={({ isActive }) =>
            `${base} ${isActive ? active : inactive}`
          }
        >
          Tracks
        </NavLink>

        <NavLink
          to="/albums"
          className={({ isActive }) =>
            `${base} ${isActive ? active : inactive}`
          }
        >
          Albums
        </NavLink>
        <NavLink
          to="/artist-applications"
          className={({ isActive }) =>
            `${base} ${isActive ? active : inactive}`
          }
        >
          Reviews
        </NavLink>

        {/* <NavLink
          to="/users"
          className={({ isActive }) =>
            `${base} ${isActive ? active : inactive}`
          }
        >
          Users
        </NavLink>

        <NavLink
          to="/team"
          className={({ isActive }) =>
            `${base} ${isActive ? active : inactive}`
          }
        >
          Team
        </NavLink> */}

        {/* <div className="mt-auto border-t border-zinc-900 pt-4">
          <NavLink
            to="/settings"
            className={({ isActive }) =>
              `${base} ${isActive ? active : inactive}`
            }
          >
            <Settings size={18} className="opacity-70" />
            <span>Settings</span>
          </NavLink>
        </div> */}
      </nav>
    </aside>
  );
}