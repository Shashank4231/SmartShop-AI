import clsx from "clsx";

function Button({
  children,
  variant = "primary",
  size = "md",
  loading = false,
  disabled = false,
  className = "",
  type = "button",
  onClick,
}) {
  const variants = {
    primary:
      "bg-slate-900 text-white hover:bg-slate-700",

    secondary:
      "bg-blue-600 text-white hover:bg-blue-700",

    outline:
      "border border-slate-300 bg-white text-slate-900 hover:bg-slate-100",

    danger:
      "bg-red-600 text-white hover:bg-red-700",

    success:
      "bg-green-600 text-white hover:bg-green-700",
  };

  const sizes = {
    sm: "px-4 py-2 text-sm",
    md: "px-6 py-3 text-sm",
    lg: "px-8 py-4 text-base",
  };

  return (
    <button
      type={type}
      disabled={loading || disabled}
      onClick={onClick}
      className={clsx(
        "rounded-xl font-semibold transition-all duration-200",
        "disabled:cursor-not-allowed disabled:opacity-60",
        variants[variant],
        sizes[size],
        className
      )}
    >
      {loading ? (
        <div className="flex items-center justify-center gap-2">
          <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent"></div>
          Loading...
        </div>
      ) : (
        children
      )}
    </button>
  );
}

export default Button;