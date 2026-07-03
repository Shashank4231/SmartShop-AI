import { Link, Outlet } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";

import { logoutUserThunk } from "../features/auth/authSlice";

function MainLayout() {
  const dispatch = useDispatch();
  const { user, isAuthenticated, loading } = useSelector((state) => state.auth);
  const { totalItems } = useSelector((state) => state.cart);
  const { items: wishlistItems } = useSelector((state) => state.wishlist);

  const handleLogout = async () => {
    await dispatch(logoutUserThunk());
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      <header className="sticky top-0 z-50 border-b bg-white">
        <nav className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4">
          <Link to="/" className="text-2xl font-bold">
            SmartShop AI
          </Link>

          <div className="hidden items-center gap-6 md:flex">
            <Link to="/" className="text-sm font-medium hover:text-blue-600">
              Home
            </Link>

            <Link
              to="/products"
              className="text-sm font-medium hover:text-blue-600"
            >
              Products
            </Link>

            {isAuthenticated && (
              <>
                <Link
                  to="/wishlist"
                  className="relative text-sm font-medium hover:text-blue-600"
                >
                  ❤️ Wishlist
                  {wishlistItems.length > 0 && (
                    <span className="ml-1 rounded-full bg-red-100 px-2 py-0.5 text-xs font-bold text-red-600">
                      {wishlistItems.length}
                    </span>
                  )}
                </Link>
                <Link
                  to="/cart"
                  className="relative text-sm font-medium hover:text-blue-600"
                >
                  🛒 Cart
                  {totalItems > 0 && (
                    <span className="ml-1 rounded-full bg-blue-100 px-2 py-0.5 text-xs font-bold text-blue-600">
                      {totalItems}
                    </span>
                  )}
                </Link>
              </>
            )}

            {isAuthenticated ? (
              <div className="flex items-center gap-4">
                <span className="rounded-full bg-blue-50 px-4 py-2 text-sm font-semibold text-blue-700">
                  {user?.name}
                </span>

                <button
                  onClick={handleLogout}
                  disabled={loading}
                  className="rounded-xl bg-red-600 px-4 py-2 text-sm font-medium text-white hover:bg-red-700 disabled:bg-red-300"
                >
                  {loading ? "Logging out..." : "Logout"}
                </button>
              </div>
            ) : (
              <>
                <Link
                  to="/login"
                  className="rounded-xl bg-slate-900 px-4 py-2 text-sm font-medium text-white hover:bg-slate-700"
                >
                  Login
                </Link>

                <Link
                  to="/register"
                  className="rounded-xl border border-slate-300 px-4 py-2 text-sm font-medium hover:bg-slate-100"
                >
                  Register
                </Link>
              </>
            )}
          </div>
        </nav>
      </header>

      <main>
        <Outlet />
      </main>

      <footer className="border-t bg-white py-6 text-center text-sm text-slate-500">
        © 2026 SmartShop AI. All rights reserved.
      </footer>
    </div>
  );
}

export default MainLayout;