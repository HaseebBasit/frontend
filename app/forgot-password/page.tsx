"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import axios from "axios";
import { API_BASE_URL } from "@/utils/api";

export default function ForgotPasswordPage() {
  const router = useRouter();

  // Step 1: "request" (enter email), Step 2: "reset" (enter code + new password)
  const [step, setStep] = useState<"request" | "reset">("request");

  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [loading, setLoading] = useState(false);
  const [resending, setResending] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  // Step 1: Send reset OTP
  const handleRequestCode = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setMessage("");

    try {
      const res = await axios.post(`${API_BASE_URL}/forgot-password`, { email });

      if (res.data.status) {
        setMessage(res.data.message || "Reset code sent to your email!");
        setStep("reset");
      } else {
        setError(res.data.message || "Could not process request");
      }
    } catch (err: any) {
      setError(
        err.response?.data?.message ||
          "Failed to send reset code. Please check your email address."
      );
    } finally {
      setLoading(false);
    }
  };

  // Step 2: Submit OTP & New Password
  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setMessage("");

    if (newPassword !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    if (newPassword.length < 6) {
      setError("Password must be at least 6 characters long");
      return;
    }

    setLoading(true);

    try {
      const res = await axios.post(`${API_BASE_URL}/reset-password`, {
        email,
        otp: otp.trim(),
        newPassword,
      });

      if (res.data.status) {
        setMessage(res.data.message || "Password reset successfully! Redirecting to login...");
        setTimeout(() => {
          router.push("/login");
        }, 1500);
      } else {
        setError(res.data.message || "Password reset failed");
      }
    } catch (err: any) {
      setError(
        err.response?.data?.message ||
          "Failed to reset password. Please verify the 6-digit code."
      );
    } finally {
      setLoading(false);
    }
  };

  // Resend OTP
  const handleResendCode = async () => {
    setResending(true);
    setError("");
    try {
      const res = await axios.post(`${API_BASE_URL}/forgot-password`, { email });
      setMessage(res.data.message || "A new code has been sent to your email!");
    } catch (err: any) {
      setError(err.response?.data?.message || "Failed to resend code");
    } finally {
      setResending(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4 py-12">
      <div className="bg-white p-8 rounded-2xl shadow-xl w-full max-w-md border border-gray-100">
        <div className="text-center mb-6">
          <div className="mx-auto w-12 h-12 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600 mb-3">
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
              />
            </svg>
          </div>
          <h1 className="text-2xl font-extrabold text-gray-900 tracking-tight">
            {step === "request" ? "Forgot Password" : "Reset Your Password"}
          </h1>
          <p className="text-sm text-gray-500 mt-1">
            {step === "request"
              ? "Enter your email to receive a password reset code"
              : `Enter the 6-digit code sent to ${email}`}
          </p>
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

        {step === "request" ? (
          /* STEP 1: Enter Email */
          <form onSubmit={handleRequestCode} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-1">
                Email Address
              </label>
              <input
                type="email"
                placeholder="you@example.com"
                required
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg text-gray-900 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-indigo-600 text-white py-3 rounded-lg font-semibold hover:bg-indigo-700 disabled:opacity-50 transition shadow-md hover:shadow-lg active:scale-[0.99] cursor-pointer"
            >
              {loading ? "Sending Code..." : "Send Reset Code"}
            </button>
          </form>
        ) : (
          /* STEP 2: Enter OTP & New Password */
          <form onSubmit={handleResetPassword} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-1">
                6-Digit Verification Code
              </label>
              <input
                type="text"
                placeholder="123456"
                required
                maxLength={6}
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg text-gray-900 text-lg font-mono tracking-widest text-center focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition"
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-1">
                New Password
              </label>
              <input
                type="password"
                placeholder="••••••••"
                required
                minLength={6}
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg text-gray-900 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-1">
                Confirm New Password
              </label>
              <input
                type="password"
                placeholder="••••••••"
                required
                minLength={6}
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg text-gray-900 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-indigo-600 text-white py-3 rounded-lg font-semibold hover:bg-indigo-700 disabled:opacity-50 transition shadow-md hover:shadow-lg active:scale-[0.99] cursor-pointer"
            >
              {loading ? "Resetting Password..." : "Reset Password"}
            </button>

            <div className="flex justify-between items-center text-xs text-gray-500 pt-2">
              <button
                type="button"
                onClick={() => setStep("request")}
                className="hover:text-indigo-600 cursor-pointer"
              >
                &larr; Change Email
              </button>
              <button
                type="button"
                onClick={handleResendCode}
                disabled={resending}
                className="text-indigo-600 font-semibold hover:underline disabled:opacity-50 cursor-pointer"
              >
                {resending ? "Sending..." : "Resend Code"}
              </button>
            </div>
          </form>
        )}

        <div className="mt-6 pt-5 border-t border-gray-100 text-center">
          <Link
            href="/login"
            className="text-sm font-semibold text-indigo-600 hover:text-indigo-500 hover:underline"
          >
            Back to Login
          </Link>
        </div>
      </div>
    </div>
  );
}

