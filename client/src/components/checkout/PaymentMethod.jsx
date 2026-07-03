function PaymentMethod({ paymentMethod, onChange }) {
  return (
    <div className="rounded-2xl bg-white p-6 shadow">
      <h3 className="text-xl font-bold text-slate-900">Payment Method</h3>

      <div className="mt-5 space-y-4">
        <label className="flex cursor-pointer items-center gap-3 rounded-xl border border-slate-200 p-4">
          <input
            type="radio"
            name="paymentMethod"
            value="COD"
            checked={paymentMethod === "COD"}
            onChange={(e) => onChange(e.target.value)}
          />

          <span className="font-semibold">Cash on Delivery</span>
        </label>

        <label className="flex cursor-not-allowed items-center gap-3 rounded-xl border border-slate-200 bg-slate-50 p-4 opacity-60">
          <input type="radio" disabled />

          <span className="font-semibold">Razorpay - Coming Soon</span>
        </label>
      </div>
    </div>
  );
}

export default PaymentMethod;