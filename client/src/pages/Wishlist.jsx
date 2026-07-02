import { useEffect } from "react";
import toast from "react-hot-toast";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";

import WishlistCard from "../components/wishlist/WishlistCard";
import {
  fetchWishlist,
  removeProductFromWishlist,
} from "../features/wishlist/wishlistSlice";

import EmptyState from "../components/ui/EmptyState";

function Wishlist() {
  const dispatch = useDispatch();
  const { items, loading, error } = useSelector((state) => state.wishlist);
  const { isAuthenticated } = useSelector((state) => state.auth);

  useEffect(() => {
    if (isAuthenticated) {
      dispatch(fetchWishlist());
    }
  }, [dispatch, isAuthenticated]);

  const handleRemove = async (productId) => {
    const result = await dispatch(removeProductFromWishlist(productId));

    if (removeProductFromWishlist.fulfilled.match(result)) {
      toast.success("Removed from wishlist");
    } else {
      toast.error(result.payload || "Failed to remove product");
    }
  };

  return (
    <section className="mx-auto max-w-7xl px-4 py-10">
      <div className="mb-8">
        <p className="text-sm font-semibold text-blue-600">Saved Products</p>
        <h2 className="mt-2 text-4xl font-bold text-slate-900">
          Your Wishlist
        </h2>
      </div>

      {loading && <p className="text-slate-600">Loading wishlist...</p>}

      {error && (
        <p className="mb-5 rounded-xl bg-red-50 px-4 py-3 text-red-600">
          {error}
        </p>
      )}

      {!loading && items.length === 0 ? (
        <EmptyState
          title="Your wishlist is empty"
          description="Save products you love and access them anytime."
          actionText="Explore Products"
          actionLink="/products"
        />
      ) : (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {items.map((product) => (
            <WishlistCard
              key={product._id}
              product={product}
              onRemove={handleRemove}
            />
          ))}
        </div>
      )}
    </section>
  );
}

export default Wishlist;