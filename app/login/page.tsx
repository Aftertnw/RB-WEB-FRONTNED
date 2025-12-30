"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useAuth } from "@/lib/auth";
import { ui } from "@/app/ui";

function IconScale() {
  return (
    <svg
      width="32"
      height="32"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M12 3v18" />
      <path d="m4 7 4 10" />
      <path d="m20 7-4 10" />
      <circle cx="4" cy="17" r="2" />
      <circle cx="20" cy="17" r="2" />
      <path d="M4 7h16" />
    </svg>
  );
}

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

export default function LoginPage() {
  const router = useRouter();
  const { login } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      await login(email, password);
      router.push("/judgments");
    } catch (err: unknown) {
      setError((err as Error).message || "เข้าสู่ระบบไม่สำเร็จ");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 px-4">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="inline-flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-amber-400 to-amber-600 text-slate-900 shadow-lg mb-4">
            <IconScale />
          </div>
          <h1 className="text-2xl font-bold text-white">Judgment Notes</h1>
          <p className="text-slate-400 mt-1">ทะเบียนคำพิพากษา</p>
        </div>

        {/* Form */}
        <div className="bg-white rounded-2xl shadow-xl p-8">
          <h2 className="text-xl font-semibold text-slate-900 mb-6">
            เข้าสู่ระบบ
          </h2>

          {error && (
            <div className="mb-4 p-3 rounded-xl bg-red-50 border border-red-200 text-red-700 text-sm">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="space-y-2">
              <label className={ui.label}>อีเมล</label>
              <input
                type="email"
                className={ui.input}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="your@email.com"
                required
              />
            </div>

            <div className="space-y-2">
              <label className={ui.label}>รหัสผ่าน</label>
              <input
                type="password"
                className={ui.input}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                required
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className={`${ui.btn} ${ui.btnPrimary} w-full justify-center`}
            >
              {loading ? <IconLoader /> : "เข้าสู่ระบบ"}
            </button>
          </form>

          <div className="mt-6 text-center text-sm text-slate-500">
            ยังไม่มีบัญชี?{" "}
            <Link
              href="/register"
              className="font-semibold text-blue-600 hover:underline"
            >
              สมัครสมาชิก
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
