import { useState } from "react";
import toast from "react-hot-toast";
import { useDispatch, useSelector } from "react-redux";
import { useLocation, useNavigate } from "react-router-dom";

import Input from "../components/forms/Input";
import Button from "../components/ui/Button";

import { clearAuthError, register } from "../features/auth/authSlice";

function Register() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();

  const from = location.state?.from?.pathname || "/login";

  const { loading, error: authError } = useSelector((state) => state.auth);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const [error, setError] = useState("");

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setError("");
    dispatch(clearAuthError());

    if (!formData.name || !formData.email || !formData.password) {
      setError("All fields are required");
      return;
    }

    if (formData.password.length < 6) {
      setError("Password must be at least 6 characters");
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    const result = await dispatch(
      register({
        name: formData.name,
        email: formData.email,
        password: formData.password,
      })
    );

    if (register.fulfilled.match(result)) {
      toast.success("Account created successfully. Please login.");

      setFormData({
        name: "",
        email: "",
        password: "",
        confirmPassword: "",
      });

      navigate(from, { replace: true });
    } else {
      toast.error(result.payload || "Registration failed");
    }
  };

  return (
    <section className="mx-auto grid min-h-[80vh] max-w-6xl items-center gap-10 px-4 py-12 md:grid-cols-2">
      <div>
        <p className="mb-4 inline-block rounded-full bg-blue-50 px-4 py-2 text-sm font-semibold text-blue-700">
          Join SmartShop AI
        </p>

        <h2 className="text-4xl font-bold text-slate-900">
          Create your account and start shopping smarter.
        </h2>

        <p className="mt-4 text-slate-600">
          Get personalized product recommendations, wishlist support, secure
          checkout, and order tracking.
        </p>
      </div>

      <form
        onSubmit={handleSubmit}
        className="rounded-3xl bg-white p-8 shadow-xl"
      >
        <h3 className="mb-6 text-2xl font-bold text-slate-900">
          Create Account
        </h3>

        {(error || authError) && (
          <p className="mb-4 rounded-xl bg-red-50 px-4 py-3 text-sm text-red-600">
            {error || authError}
          </p>
        )}

        <div className="space-y-5">
          <Input
            label="Full Name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            placeholder="Enter your full name"
          />

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
            placeholder="Create password"
          />

          <Input
            label="Confirm Password"
            type="password"
            name="confirmPassword"
            value={formData.confirmPassword}
            onChange={handleChange}
            placeholder="Confirm password"
          />
        </div>

        <Button type="submit" loading={loading} className="mt-6 w-full">
          Register
        </Button>
      </form>
    </section>
  );
}

export default Register;