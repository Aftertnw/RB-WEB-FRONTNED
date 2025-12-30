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

export default function RegisterPage() {
  const router = useRouter();
  const { register } = useAuth();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");

    if (password !== confirmPassword) {
      setError("รหัสผ่านไม่ตรงกัน");
      return;
    }

    if (password.length < 6) {
      setError("รหัสผ่านต้องมีอย่างน้อย 6 ตัวอักษร");
      return;
    }

    setLoading(true);

    try {
      await register(email, password, name);
      router.push("/judgments");
    } catch (err: unknown) {
      setError((err as Error).message || "สมัครสมาชิกไม่สำเร็จ");
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
            สมัครสมาชิก
          </h2>

          {error && (
            <div className="mb-4 p-3 rounded-xl bg-red-50 border border-red-200 text-red-700 text-sm">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="space-y-2">
              <label className={ui.label}>ชื่อ</label>
              <input
                type="text"
                className={ui.input}
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="ชื่อของคุณ"
                required
              />
            </div>

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
                placeholder="อย่างน้อย 6 ตัวอักษร"
                required
              />
            </div>

            <div className="space-y-2">
              <label className={ui.label}>ยืนยันรหัสผ่าน</label>
              <input
                type="password"
                className={ui.input}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="กรอกรหัสผ่านอีกครั้ง"
                required
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className={`${ui.btn} ${ui.btnPrimary} w-full justify-center`}
            >
              {loading ? <IconLoader /> : "สมัครสมาชิก"}
            </button>
          </form>

          <div className="mt-6 text-center text-sm text-slate-500">
            มีบัญชีอยู่แล้ว?{" "}
            <Link
              href="/login"
              className="font-semibold text-blue-600 hover:underline"
            >
              เข้าสู่ระบบ
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
