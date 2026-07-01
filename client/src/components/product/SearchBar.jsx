function SearchBar({ value, onChange, onSubmit }) {
  return (
    <form onSubmit={onSubmit} className="flex gap-3">
      <input
        value={value}
        onChange={onChange}
        placeholder="Search products..."
        className="w-full rounded-xl border border-slate-300 px-4 py-3 outline-none focus:border-slate-900"
      />

      <button className="rounded-xl bg-slate-900 px-6 py-3 font-semibold text-white hover:bg-slate-700">
        Search
      </button>
    </form>
  );
}

export default SearchBar;