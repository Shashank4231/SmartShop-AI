function QuantitySelector({ quantity, onIncrease, onDecrease, disabled }) {
  return (
    <div className="flex items-center gap-3">
      <button
        onClick={onDecrease}
        disabled={disabled || quantity <= 1}
        className="flex h-9 w-9 items-center justify-center rounded-lg border border-slate-300 font-bold hover:bg-slate-100 disabled:cursor-not-allowed disabled:opacity-50"
      >
        -
      </button>

      <span className="min-w-8 text-center font-semibold">{quantity}</span>

      <button
        onClick={onIncrease}
        disabled={disabled}
        className="flex h-9 w-9 items-center justify-center rounded-lg border border-slate-300 font-bold hover:bg-slate-100 disabled:cursor-not-allowed disabled:opacity-50"
      >
        +
      </button>
    </div>
  );
}

export default QuantitySelector;