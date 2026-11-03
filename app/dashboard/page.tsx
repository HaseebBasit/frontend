"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";

export default function DashboardPage() {
  const router = useRouter();
  const { user, token, logout, loading } = useAuth();

  useEffect(() => {
    if (!loading && !token) {
      router.push("/login");
    }
  }, [loading, token, router]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  const handleLogout = () => {
    logout();
    router.push("/login");
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navigation */}
      <nav className="bg-white border-b border-gray-200">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 items-center">
            <div className="flex items-center space-x-3">
              <div className="h-9 w-9 rounded-xl bg-indigo-600 flex items-center justify-center text-white font-bold text-lg shadow-sm">
                A
              </div>
              <span className="text-xl font-bold text-gray-900">AuthPortal</span>
            </div>
            <button
              onClick={handleLogout}
              className="px-4 py-2 text-sm font-semibold text-red-600 bg-red-50 hover:bg-red-100 rounded-lg transition border border-red-200 cursor-pointer"
            >
              Sign Out
            </button>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
          {/* Header banner */}
          <div className="bg-gradient-to-r from-indigo-600 to-purple-600 px-8 py-8 text-white">
            <span className="inline-block px-3 py-1 bg-white/20 backdrop-blur-sm rounded-full text-xs font-semibold tracking-wide uppercase mb-2">
              Protected Dashboard
            </span>
            <h1 className="text-3xl font-extrabold">Welcome, {user.userName}!</h1>
            <p className="text-indigo-100 text-sm mt-1">
              You have successfully authenticated with hashed password verification.
            </p>
          </div>

          {/* User Details */}
          <div className="p-8">
            <h2 className="text-lg font-bold text-gray-900 mb-4">Account Information</h2>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="p-4 rounded-xl bg-gray-50 border border-gray-100">
                <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider">User Name</p>
                <p className="text-base font-semibold text-gray-900 mt-1">{user.userName}</p>
              </div>

              <div className="p-4 rounded-xl bg-gray-50 border border-gray-100">
                <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Email Address</p>
                <p className="text-base font-semibold text-gray-900 mt-1">{user.email}</p>
              </div>

              <div className="p-4 rounded-xl bg-gray-50 border border-gray-100">
                <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Assigned Role</p>
                <span className="inline-block mt-1 px-3 py-0.5 rounded-full text-xs font-bold uppercase tracking-wider bg-indigo-100 text-indigo-800">
                  {user.role}
                </span>
              </div>
            </div>

            <div className="mt-8 pt-6 border-t border-gray-100 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-gray-500">
              <div className="flex items-center space-x-2">
                <span className="h-2.5 w-2.5 rounded-full bg-emerald-500 inline-block"></span>
                <span>Session active &bull; Password protected with bcrypt hash</span>
              </div>
              <button
                onClick={handleLogout}
                className="text-gray-500 hover:text-red-600 transition underline cursor-pointer"
              >
                Log out of session
              </button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

