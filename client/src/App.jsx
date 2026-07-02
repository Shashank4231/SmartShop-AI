import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";

import AppRoutes from "./routes/AppRoutes";
import { loadCurrentUser } from "./features/auth/authSlice";
import { fetchCart } from "./features/cart/cartSlice";
import Loader from "./components/ui/Loader";

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
    return <Loader text="Loading SmartShop AI..." />;
  }

  return <AppRoutes />;
}

export default App;
