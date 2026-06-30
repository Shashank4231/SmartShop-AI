import { useState } from "react";
import Input from "../components/forms/Input";

function Login() {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [error, setError] = useState("");

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setError("");

    if (!formData.email || !formData.password) {
      setError("Email and password are required");
      return;
    }

    console.log("Login Data:", formData);
  };

  return (
    <section className="mx-auto grid min-h-[80vh] max-w-6xl items-center gap-10 px-4 py-12 md:grid-cols-2">
      <div>
        <p className="mb-4 inline-block rounded-full bg-blue-50 px-4 py-2 text-sm font-semibold text-blue-700">
          Welcome Back
        </p>

        <h2 className="text-4xl font-bold text-slate-900">
          Login to continue your smart shopping journey.
        </h2>

        <p className="mt-4 text-slate-600">
          Access your cart, wishlist, orders, personalized recommendations, and
          secure checkout.
        </p>
      </div>

      <form
        onSubmit={handleSubmit}
        className="rounded-3xl bg-white p-8 shadow-xl"
      >
        <h3 className="mb-6 text-2xl font-bold text-slate-900">Login</h3>

        {error && (
          <p className="mb-4 rounded-xl bg-red-50 px-4 py-3 text-sm text-red-600">
            {error}
          </p>
        )}

        <div className="space-y-5">
          <Input
            label="Email Address"
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="Enter your email"
          />

          <Input
            label="Password"
            type="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            placeholder="Enter your password"
          />
        </div>

        <div className="mt-4 flex justify-end">
          <a href="/forgot-password" className="text-sm font-medium text-blue-600">
            Forgot Password?
          </a>
        </div>

        <button className="mt-6 w-full rounded-xl bg-slate-900 px-6 py-3 font-semibold text-white hover:bg-slate-700">
          Login
        </button>
      </form>
    </section>
  );
}

export default Login;