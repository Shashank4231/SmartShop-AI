import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";

import AppRoutes from "./routes/AppRoutes";
import { loadCurrentUser } from "./features/auth/authSlice";
import { fetchCart } from "./features/cart/cartSlice";

function App() {
  const dispatch = useDispatch();
  const { initialized, loading } = useSelector((state) => state.auth);

useEffect(() => {
  dispatch(loadCurrentUser()).then((result) => {
    if (loadCurrentUser.fulfilled.match(result)) {
      dispatch(fetchCart());
    }
  });
}, [dispatch]);

  if (!initialized && loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-50">
        <p className="text-lg font-semibold text-slate-700">
          Loading SmartShop AI...
        </p>
      </div>
    );
  }

  return <AppRoutes />;
}

export default App;
