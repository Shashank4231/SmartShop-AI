import { Link, useLocation } from "react-router-dom";
import Button from "../components/ui/Button";

function OrderSuccess() {
  const location = useLocation();
  const order = location.state?.order;

  return (
    <section className="flex min-h-[80vh] items-center justify-center px-4">
      <div className="max-w-xl rounded-3xl bg-white p-10 text-center shadow-xl">
        <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-green-100 text-4xl">
          ✅
        </div>

        <h1 className="mt-6 text-4xl font-bold text-slate-900">
          Order Placed Successfully!
        </h1>

        <p className="mt-4 text-slate-600">
          Thank you for shopping with SmartShop AI. Your order has been received
          and is now being processed.
        </p>

        {order?._id && (
          <p className="mt-5 rounded-xl bg-slate-50 px-4 py-3 text-sm font-semibold text-slate-700">
            Order ID: #{order._id.slice(-8).toUpperCase()}
          </p>
        )}

        <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:justify-center">
          <Link to="/orders">
            <Button>View My Orders</Button>
          </Link>

          <Link to="/products">
            <Button variant="outline">Continue Shopping</Button>
          </Link>
        </div>
      </div>
    </section>
  );
}

export default OrderSuccess;