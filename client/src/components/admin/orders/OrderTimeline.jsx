const steps = [
  "Pending",
  "Confirmed",
  "Packed",
  "Shipped",
  "Out for Delivery",
  "Delivered",
];

function OrderTimeline({ currentStatus }) {
  if (currentStatus === "Cancelled") {
    return (
      <div className="rounded-2xl bg-white p-6 shadow">
        <h2 className="mb-6 text-xl font-bold text-slate-900">
          Order Timeline
        </h2>

        <div className="rounded-xl bg-red-50 px-4 py-3 font-semibold text-red-600">
          This order has been cancelled.
        </div>
      </div>
    );
  }

  const currentIndex = steps.indexOf(currentStatus);

  return (
    <div className="rounded-2xl bg-white p-6 shadow">
      <h2 className="mb-6 text-xl font-bold text-slate-900">
        Order Timeline
      </h2>

      <div className="space-y-5">
        {steps.map((step, index) => {
          const completed = index <= currentIndex;

          return (
            <div key={step} className="flex gap-4">
              <div className="flex flex-col items-center">
                <div
                  className={`flex h-8 w-8 items-center justify-center rounded-full text-sm font-bold ${
                    completed
                      ? "bg-green-600 text-white"
                      : "bg-slate-200 text-slate-500"
                  }`}
                >
                  {completed ? "✓" : index + 1}
                </div>

                {index !== steps.length - 1 && (
                  <div
                    className={`h-8 w-1 ${
                      index < currentIndex ? "bg-green-600" : "bg-slate-200"
                    }`}
                  />
                )}
              </div>

              <div>
                <p
                  className={`font-semibold ${
                    completed ? "text-slate-900" : "text-slate-400"
                  }`}
                >
                  {step}
                </p>

                <p className="text-sm text-slate-500">
                  {completed ? "Completed" : "Pending"}
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default OrderTimeline;