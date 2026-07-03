import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

import ProductGrid from "../components/product/ProductGrid";
import SearchBar from "../components/product/SearchBar";
import {
  fetchProducts,
  setProductFilters,
  clearProductFilters,
} from "../features/product/productSlice";

import Loader from "../components/ui/Loader";
import ProductCardSkeleton from "../components/skeleton/ProductCardSkeleton";

function Products() {
  const dispatch = useDispatch();
  const { products, pagination, loading, error, filters } = useSelector(
    (state) => state.products
  );

  const [searchInput, setSearchInput] = useState(filters.search);

  useEffect(() => {
    dispatch(fetchProducts(filters));
  }, [dispatch, filters]);

  const handleSearch = (e) => {
    e.preventDefault();

    dispatch(
      setProductFilters({
        search: searchInput,
        page: 1,
      })
    );
  };

  const handleClear = () => {
    setSearchInput("");
    dispatch(clearProductFilters());
  };

  const handlePageChange = (page) => {
    dispatch(setProductFilters({ page }));
  };

  return (
    <section className="mx-auto max-w-7xl px-4 py-10">
      <div className="mb-8">
        <p className="text-sm font-semibold text-blue-600">
          SmartShop AI Store
        </p>
        <h2 className="mt-2 text-4xl font-bold text-slate-900">
          Explore Products
        </h2>
        <p className="mt-3 text-slate-600">
          Search and discover products uploaded by admin.
        </p>
      </div>

      <div className="mb-8 rounded-2xl bg-white p-5 shadow">
        <SearchBar
          value={searchInput}
          onChange={(e) => setSearchInput(e.target.value)}
          onSubmit={handleSearch}
        />

        <button
          onClick={handleClear}
          className="mt-3 text-sm font-semibold text-slate-500 hover:text-slate-900"
        >
          Clear filters
        </button>
      </div>

      {loading && (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 6 }).map((_, index) => (
            <ProductCardSkeleton key={index} />
          ))}
        </div>
      )}

      {error && (
        <p className="rounded-xl bg-red-50 px-4 py-3 text-red-600">{error}</p>
      )}

      {!loading && !error && <ProductGrid products={products} />}

      {pagination?.totalPages > 1 && (
        <div className="mt-10 flex justify-center gap-3">
          {Array.from({ length: pagination.totalPages }, (_, index) => (
            <button
              key={index + 1}
              onClick={() => handlePageChange(index + 1)}
              className={`rounded-lg px-4 py-2 font-semibold ${pagination.currentPage === index + 1
                  ? "bg-slate-900 text-white"
                  : "bg-white text-slate-700"
                }`}
            >
              {index + 1}
            </button>
          ))}
        </div>
      )}
    </section>
  );
}

export default Products;