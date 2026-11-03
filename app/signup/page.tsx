"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import axios from "axios";

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:2707";

export default function SignupPage() {
  const router = useRouter();
  const [form, setForm] = useState({
    userName: "",
    email: "",
    password: "",
    role: "student",
  });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setMessage("");

    try {
      const res = await axios.post(`${API_BASE_URL}/signup`, form);

      if (res.data.status) {
        setMessage(res.data.message || "Account created successfully! Redirecting to login...");
        setTimeout(() => {
          router.push("/login");
        }, 1200);
      } else {
        setError(res.data.message || "Signup failed");
      }
    } catch (err: any) {
      setError(
        err.response?.data?.message ||
          "Could not connect to backend server. Make sure it is running on port 2707."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4 py-12">
      <div className="bg-white p-8 rounded-2xl shadow-xl w-full max-w-md border border-gray-100">
        <div className="text-center mb-6">
          <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">Create Account</h1>
          <p className="text-sm text-gray-500 mt-1">Sign up to get started</p>
        </div>

        {message && (
          <div className="mb-4 p-3 rounded-lg bg-green-50 border border-green-200 text-green-700 text-sm text-center font-medium">
            {message}
          </div>
        )}
        {error && (
          <div className="mb-4 p-3 rounded-lg bg-red-50 border border-red-200 text-red-700 text-sm text-center font-medium">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-1">
              Full Name
            </label>
            <input
              type="text"
              placeholder="e.g. John Doe"
              required
              className="w-full px-4 py-2.5 border border-gray-300 rounded-lg text-gray-900 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition"
              value={form.userName}
              onChange={(e) => setForm({ ...form, userName: e.target.value })}
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-1">
              Email Address
            </label>
            <input
              type="email"
              placeholder="you@example.com"
              required
              className="w-full px-4 py-2.5 border border-gray-300 rounded-lg text-gray-900 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-1">
              Password
            </label>
            <input
              type="password"
              placeholder="••••••••"
              required
              minLength={6}
              className="w-full px-4 py-2.5 border border-gray-300 rounded-lg text-gray-900 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition"
              value={form.password}
              onChange={(e) => setForm({ ...form, password: e.target.value })}
            />
            <p className="text-xs text-gray-400 mt-1">Must be at least 6 characters (hashed securely with bcrypt)</p>
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-1">
              Select Role
            </label>
            <select
              className="w-full px-4 py-2.5 border border-gray-300 rounded-lg text-gray-900 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition"
              value={form.role}
              onChange={(e) => setForm({ ...form, role: e.target.value })}
            >
              <option value="student">Student</option>
              <option value="trainer">Trainer</option>
            </select>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-indigo-600 text-white py-3 rounded-lg font-semibold hover:bg-indigo-700 disabled:opacity-50 transition shadow-md hover:shadow-lg active:scale-[0.99] cursor-pointer"
          >
            {loading ? "Creating Account..." : "Sign Up"}
          </button>
        </form>

        <p className="mt-6 text-center text-sm text-gray-600">
          Already have an account?{" "}
          <Link href="/login" className="font-semibold text-indigo-600 hover:text-indigo-500 hover:underline">
            Login
          </Link>
        </p>
      </div>
    </div>
  );
}
