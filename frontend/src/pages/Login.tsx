import { useState } from "react";
import { useAuthStore } from "../store/authStore";
import { useNavigate, Link } from "react-router-dom";

export default function Login() {
  const login = useAuthStore((s) => s.login);
  const error = useAuthStore((s) => s.error);
  const loading = useAuthStore((s) => s.loading);

  const navigate = useNavigate();

  const [form, setForm] = useState({
    email: "",
    password: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await login(form.email, form.password);

    if (localStorage.getItem("token")) navigate("/dashboard");
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gradient-to-br from-blue-50 to-blue-100 p-4">
      <div className="bg-white p-10 rounded-2xl shadow-xl w-full max-w-md border border-blue-100">
        <h1 className="text-3xl font-bold text-center text-blue-700 mb-6">
          Welcome Back
        </h1>
        <p className="text-center text-gray-600 mb-8">
          Log in to manage your shuttle rides.
        </p>

        <form className="space-y-5" onSubmit={handleSubmit}>
          <input
            className="w-full border border-gray-300 rounded-lg p-3 text-lg focus:ring-2 focus:ring-blue-400 focus:border-blue-400"
            type="email"
            name="email"
            placeholder="Email"
            value={form.email}
            onChange={handleChange}
            required
          />

          <input
            className="w-full border border-gray-300 rounded-lg p-3 text-lg focus:ring-2 focus:ring-blue-400 focus:border-blue-400"
            type="password"
            name="password"
            placeholder="Password"
            value={form.password}
            onChange={handleChange}
            required
          />

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 text-white py-3 text-lg font-semibold rounded-xl hover:bg-blue-700 transition focus:ring-2 focus:ring-blue-300"
          >
            {loading ? "Logging in..." : "Log In"}
          </button>

          {error && (
            <p className="text-red-600 text-center text-sm mt-2">{error}</p>
          )}
        </form>

        <p className="text-center mt-6 text-gray-700">
          New to ShuttleBook?{" "}
          <Link className="text-blue-600 font-semibold hover:underline" to="/signup">
            Create an account
          </Link>
        </p>
      </div>
    </div>
  );
}
