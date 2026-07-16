function PaymentMethod({ paymentMethod, onChange }) {
  const methods = [
    {
      id: "COD",
      title: "Cash on Delivery",
      description: "Pay when your order is delivered.",
    },
    {
      id: "RAZORPAY",
      title: "Razorpay",
      description: "Pay securely using UPI, cards, net banking, or wallets.",
    },
  ];

  return (
    <div className="rounded-2xl bg-white p-6 shadow">
      <h3 className="text-xl font-bold text-slate-900">
        Payment Method
      </h3>

      <div className="mt-5 space-y-4">
        {methods.map((method) => {
          const selected = paymentMethod === method.id;

          return (
            <label
              key={method.id}
              className={`flex cursor-pointer items-start gap-4 rounded-2xl border p-5 transition ${
                selected
                  ? "border-blue-600 bg-blue-50"
                  : "border-slate-200 hover:border-slate-400"
              }`}
            >
              <input
                type="radio"
                name="paymentMethod"
                value={method.id}
                checked={selected}
                onChange={(event) => onChange(event.target.value)}
                className="mt-1 h-4 w-4"
              />

              <div>
                <p className="font-bold text-slate-900">
                  {method.title}
                </p>

                <p className="mt-1 text-sm text-slate-500">
                  {method.description}
                </p>
              </div>
            </label>
          );
        })}
      </div>
    </div>
  );
}

export default PaymentMethod;