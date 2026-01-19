"use client";

import { useState, useEffect } from "react";
import { Eye, EyeOff } from "lucide-react";
import { ui } from "@/app/ui";
import { useAuth } from "@/lib/auth";
import { useTranslation } from "react-i18next";

function IconLoader() {
  return (
    <svg
      className="h-5 w-5 animate-spin"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
    >
      <path d="M21 12a9 9 0 1 1-6.219-8.56" strokeLinecap="round" />
    </svg>
  );
}

export default function SessionExpiredDialog() {
  const { t } = useTranslation();
  const { login, user } = useAuth(); // We might need to know WHO the user was? Or just a generic login?
  // Ideally, pre-fill email if we know it.

  const [open, setOpen] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const handleExpired = () => {
      // Only if we were previously logged in?
      // If we get 401, we should show this.
      setOpen(true);
      // Pre-fill email if user context is still available
      if (user?.email) setEmail(user.email);
    };

    window.addEventListener("auth:session-expired", handleExpired);
    return () =>
      window.removeEventListener("auth:session-expired", handleExpired);
  }, [user]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      await login(email, password);
      setOpen(false); // Close on success
      setPassword("");
      // Do NOT redirect, let them continue.
    } catch (err: unknown) {
      setError((err as Error).message || "Login failed");
    } finally {
      setLoading(false);
    }
  }

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
      <div className="w-full max-w-sm bg-white rounded-2xl shadow-2xl p-6 ring-1 ring-slate-900/5 animate-in fade-in zoom-in duration-200">
        <div className="text-center mb-6">
          <h2 className="text-lg font-semibold text-slate-900">
            Session Expired
          </h2>
          <p className="text-slate-500 text-sm mt-1">
            Please log in again to continue your session.
          </p>
        </div>

        {error && (
          <div className="mb-4 p-3 rounded-xl bg-red-50 border border-red-200 text-red-700 text-sm">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <label className={ui.label}>{t("login.email")}</label>
            <input
              type="email"
              className={ui.input}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="email@example.com"
              required
              // If we pre-filled, maybe read-only? No, allow change just in case.
            />
          </div>

          <div className="space-y-2">
            <label className={ui.label}>{t("login.password")}</label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                className={`${ui.input} pr-10`}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 outline-none"
                tabIndex={-1}
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className={`${ui.btn} ${ui.btnPrimary} w-full justify-center`}
          >
            {loading ? <IconLoader /> : t("login.submit")}
          </button>

          <button
            type="button"
            onClick={() => {
              // Perform full logout logic
              localStorage.removeItem("token");
              localStorage.removeItem("user");
              window.location.href = "/login"; // Hard redirect to clear everything
            }}
            className={`${ui.btn} w-full justify-center bg-transparent border border-slate-200 text-slate-600 hover:bg-slate-50 mt-3`}
          >
            {t("sidebar.logout")}
          </button>
        </form>
      </div>
    </div>
  );
}
