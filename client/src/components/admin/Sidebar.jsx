import { NavLink } from "react-router-dom";
import {
  LayoutDashboard,
  Package,
  Shapes,
  ShoppingBag,
  Users,
  Store,
} from "lucide-react";

const links = [
  {
    name: "Dashboard",
    path: "/admin",
    end: true,
    icon: LayoutDashboard,
  },
  {
    name: "Products",
    path: "/admin/products",
    icon: Package,
  },
  {
    name: "Categories",
    path: "/admin/categories",
    icon: Shapes,
  },
  {
    name: "Orders",
    path: "/admin/orders",
    icon: ShoppingBag,
  },
  {
    name: "Users",
    path: "/admin/users",
    icon: Users,
  },
];

function Sidebar() {
  return (
    <aside className="min-h-screen w-72 shrink-0 bg-slate-950 text-white">
      <div className="border-b border-slate-800 p-6">
        <div className="flex items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-600">
            <Store size={24} />
          </div>

          <div>
            <h2 className="text-xl font-bold">SmartShop AI</h2>
            <p className="text-sm text-slate-400">Admin Panel</p>
          </div>
        </div>
      </div>

      <nav className="p-4">
        <p className="mb-3 px-4 text-xs font-bold uppercase tracking-wider text-slate-500">
          Management
        </p>

        {links.map((link) => {
          const Icon = link.icon;

          return (
            <NavLink
              key={link.path}
              end={link.end}
              to={link.path}
              className={({ isActive }) =>
                `mb-2 flex items-center gap-3 rounded-xl px-4 py-3 font-medium transition ${
                  isActive
                    ? "bg-blue-600 text-white shadow-lg shadow-blue-950/30"
                    : "text-slate-300 hover:bg-slate-800 hover:text-white"
                }`
              }
            >
              <Icon size={20} />
              <span>{link.name}</span>
            </NavLink>
          );
        })}
      </nav>
    </aside>
  );
}

export default Sidebar;