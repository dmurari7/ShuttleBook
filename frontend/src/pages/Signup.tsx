import { useState } from "react";
import { useAuthStore } from "../store/authStore";
import { useNavigate, Link } from "react-router-dom";

export default function Signup() {
  const signup = useAuthStore((s) => s.signup);
  const error = useAuthStore((s) => s.error);
  const loading = useAuthStore((s) => s.loading);

  const navigate = useNavigate();

  const [form, setForm] = useState({
    username: "",
    email: "",
    password: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await signup(form.username, form.email, form.password);

    if (localStorage.getItem("token")) navigate("/dashboard");
  };

  return (
    <div className="fixed inset-0 flex justify-center items-center bg-gradient-to-br from-blue-50 via-white to-blue-100 p-4 overflow-auto">
      <div className="bg-white p-10 rounded-3xl shadow-2xl w-full max-w-md border-2 border-blue-200 relative overflow-hidden">
        {/* Decorative background elements */}
        <div className="absolute top-0 right-0 w-32 h-32 bg-blue-100 rounded-full -mr-16 -mt-16 opacity-50"></div>
        <div className="absolute bottom-0 left-0 w-24 h-24 bg-blue-100 rounded-full -ml-12 -mb-12 opacity-50"></div>
        
        {/* Shuttlecock Icon */}
        <div className="flex justify-center mb-4 relative z-10">
          <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-blue-700 rounded-full flex items-center justify-center shadow-lg">
            <span className="text-5xl">🏸</span>
          </div>
        </div>

        <h1 className="text-4xl font-bold text-center bg-gradient-to-r from-blue-600 to-blue-800 bg-clip-text text-transparent mb-2 relative z-10">
          Create Account
        </h1>
        <p className="text-center text-gray-600 mb-8 relative z-10">
          Join to book badminton courts in your area
        </p>

        <form className="space-y-5 relative z-10" onSubmit={handleSubmit}>
          <div>
            <input
              className="w-full border-2 border-gray-200 rounded-xl p-4 text-base focus:ring-4 focus:ring-blue-200 focus:border-blue-500 transition-all duration-200 outline-none bg-gray-50 focus:bg-white"
              name="username"
              placeholder="Username"
              value={form.username}
              onChange={handleChange}
              required
            />
          </div>

          <div>
            <input
              className="w-full border-2 border-gray-200 rounded-xl p-4 text-base focus:ring-4 focus:ring-blue-200 focus:border-blue-500 transition-all duration-200 outline-none bg-gray-50 focus:bg-white"
              type="email"
              name="email"
              placeholder="Email"
              value={form.email}
              onChange={handleChange}
              required
            />
          </div>

          <div>
            <input
              className="w-full border-2 border-gray-200 rounded-xl p-4 text-base focus:ring-4 focus:ring-blue-200 focus:border-blue-500 transition-all duration-200 outline-none bg-gray-50 focus:bg-white"
              type="password"
              name="password"
              placeholder="Password"
              value={form.password}
              onChange={handleChange}
              required
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-gradient-to-r from-blue-600 to-blue-700 text-white py-4 text-lg font-semibold rounded-xl hover:from-blue-700 hover:to-blue-800 transition-all duration-200 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed transform hover:scale-[1.02] active:scale-[0.98]"
          >
            {loading ? "Creating account..." : "Sign Up"}
          </button>

          {error && (
            <div className="bg-red-50 border-2 border-red-200 rounded-lg p-3">
              <p className="text-red-600 text-center text-sm">{error}</p>
            </div>
          )}
        </form>

        <p className="text-center mt-8 text-gray-600 relative z-10">
          Already have an account?{" "}
          <Link className="text-blue-600 font-semibold hover:text-blue-800 hover:underline transition-colors" to="/login">
            Log in
          </Link>
        </p>
      </div>
    </div>
  );
}