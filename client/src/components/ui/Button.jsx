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
  leftIcon,
  rightIcon,
}) {
  const variants = {
    primary:
      "bg-slate-900 text-white hover:bg-slate-800 focus:ring-slate-900",

    secondary:
      "bg-blue-600 text-white hover:bg-blue-700 focus:ring-blue-600",

    outline:
      "border border-slate-300 bg-white text-slate-900 hover:bg-slate-50 focus:ring-slate-400",

    danger:
      "bg-red-600 text-white hover:bg-red-700 focus:ring-red-600",

    success:
      "bg-green-600 text-white hover:bg-green-700 focus:ring-green-600",
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
        "inline-flex items-center justify-center gap-2 rounded-xl font-semibold",
        "transition-all duration-200",
        "hover:-translate-y-0.5 hover:shadow-lg",
        "active:translate-y-0 active:scale-[0.98]",
        "focus:outline-none focus:ring-2 focus:ring-offset-2",
        "disabled:cursor-not-allowed disabled:opacity-60 disabled:hover:translate-y-0 disabled:hover:shadow-none",
        variants[variant],
        sizes[size],
        className
      )}
    >
      {loading ? (
        <>
          <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
          Loading...
        </>
      ) : (
        <>
          {leftIcon}
          {children}
          {rightIcon}
        </>
      )}
    </button>
  );
}

export default Button;