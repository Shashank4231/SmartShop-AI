import { Outlet } from "react-router-dom";

function MainLayout() {
  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      <header className="sticky top-0 z-50 border-b bg-white">
        <nav className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4">
          <h1 className="text-2xl font-bold">SmartShop AI</h1>

          <div className="hidden items-center gap-6 md:flex">
            <a href="/" className="text-sm font-medium hover:text-blue-600">
              Home
            </a>
            <a href="/products" className="text-sm font-medium hover:text-blue-600">
              Products
            </a>
            <a href="/cart" className="text-sm font-medium hover:text-blue-600">
              Cart
            </a>
            <a href="/login" className="rounded-xl bg-slate-900 px-4 py-2 text-sm font-medium text-white hover:bg-slate-700">
              Login
            </a>
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