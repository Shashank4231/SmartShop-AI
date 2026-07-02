import ProductCard from "./ProductCard";
import EmptyState from "../ui/EmptyState";

function ProductGrid({ products }) {
  if (!products.length) {
    return (
      <EmptyState
        title="No products found"
        description="Try searching with another keyword or clearing filters."
      />
    );
  }

  return (
    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {products.map((product) => (
        <ProductCard key={product._id} product={product} />
      ))}
    </div>
  );
}

export default ProductGrid;