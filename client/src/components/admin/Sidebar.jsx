import { NavLink } from "react-router-dom";

const links = [
  {
    name: "Dashboard",
    path: "/admin",
    end: true,
  },
  {
    name: "Products",
    path: "/admin/products",
  },
  {
    name: "Categories",
    path: "/admin/categories",
  },
  {
    name: "Orders",
    path: "/admin/orders",
  },
  {
    name: "Users",
    path: "/admin/users",
  },
];

function Sidebar() {
  return (
    <aside className="min-h-screen w-72 bg-slate-900 text-white">
      <div className="border-b border-slate-700 p-6">
        <h2 className="text-2xl font-bold">
          SmartShop AI
        </h2>

        <p className="mt-1 text-sm text-slate-400">
          Admin Panel
        </p>
      </div>

      <nav className="p-4">
        {links.map((link) => (
          <NavLink
            key={link.path}
            end={link.end}
            to={link.path}
            className={({ isActive }) =>
              `mb-2 block rounded-xl px-4 py-3 transition ${
                isActive
                  ? "bg-blue-600"
                  : "hover:bg-slate-800"
              }`
            }
          >
            {link.name}
          </NavLink>
        ))}
      </nav>
    </aside>
  );
}

export default Sidebar;