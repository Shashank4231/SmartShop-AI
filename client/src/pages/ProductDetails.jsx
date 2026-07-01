import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";

import { addProductToCart } from "../features/cart/cartSlice";
import { fetchProductBySlug } from "../features/product/productSlice";

function ProductDetails() {
  const { slug } = useParams();
  const dispatch = useDispatch();

  const { selectedProduct: product, loading, error } = useSelector(
    (state) => state.products
  );

  const { isAuthenticated } = useSelector((state) => state.auth);

  const [activeImage, setActiveImage] = useState("");

  useEffect(() => {
    dispatch(fetchProductBySlug(slug));
  }, [dispatch, slug]);

  useEffect(() => {
    if (product?.images?.length > 0) {
      setActiveImage(product.images[0].url);
    }
  }, [product]);

  const handleAddToCart = async () => {
    if (!isAuthenticated) {
      alert("Please login to add products to cart");
      return;
    }

    const result = await dispatch(
      addProductToCart({
        productId: product._id,
        quantity: 1,
      })
    );

    if (addProductToCart.fulfilled.match(result)) {
      alert("Product added to cart");
    }
  };

  if (loading) {
    return <p className="mx-auto max-w-7xl px-4 py-16">Loading product...</p>;
  }

  if (error) {
    return (
      <p className="mx-auto max-w-7xl px-4 py-16 text-red-600">{error}</p>
    );
  }

  if (!product) {
    return null;
  }

  return (
    <section className="mx-auto max-w-7xl px-4 py-10">
      <div className="grid gap-10 md:grid-cols-2">
        <div>
          <div className="overflow-hidden rounded-3xl bg-white shadow">
            <img
              src={activeImage || "https://placehold.co/700x500"}
              alt={product.title}
              className="h-[420px] w-full object-cover"
            />
          </div>

          <div className="mt-4 flex gap-3">
            {product.images?.map((image) => (
              <button
                key={image.public_id}
                onClick={() => setActiveImage(image.url)}
                className="h-20 w-20 overflow-hidden rounded-xl border"
              >
                <img
                  src={image.url}
                  alt={product.title}
                  className="h-full w-full object-cover"
                />
              </button>
            ))}
          </div>
        </div>

        <div>
          <p className="text-sm font-semibold text-blue-600">
            {product.category?.name}
          </p>

          <h1 className="mt-3 text-4xl font-bold text-slate-900">
            {product.title}
          </h1>

          <p className="mt-2 text-slate-500">Brand: {product.brand}</p>

          <div className="mt-5 flex items-end gap-3">
            <p className="text-3xl font-bold text-slate-900">
              ₹{product.discountPrice || product.price}
            </p>

            {product.discountPrice > 0 && (
              <p className="text-lg text-slate-400 line-through">
                ₹{product.price}
              </p>
            )}
          </div>

          <p className="mt-5 leading-7 text-slate-600">
            {product.description}
          </p>

          <p className="mt-5 font-semibold">
            {product.stock > 0 ? "✅ In Stock" : "❌ Out of Stock"}
          </p>

          <div className="mt-8 flex gap-4">
            <button
              onClick={handleAddToCart}
              className="rounded-xl bg-slate-900 px-6 py-3 font-semibold text-white hover:bg-slate-700"
            >
              Add to Cart
            </button>

            <button className="rounded-xl border border-slate-300 px-6 py-3 font-semibold hover:bg-slate-100">
              Add to Wishlist
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}

export default ProductDetails;