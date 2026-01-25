"use client";

import { Eye, EyeOff } from "lucide-react";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useAuth } from "@/lib/auth";
import { ui } from "@/app/ui";
import { useTranslation } from "react-i18next";
import { LanguageChanger } from "@/components/layout/LanguageChanger";

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
  const { t } = useTranslation();
  const { register } = useAuth();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");

    if (password !== confirmPassword) {
      setError(t("register.password_mismatch"));
      return;
    }

    if (password.length < 6) {
      setError("รหัสผ่านต้องมีอย่างน้อย 6 ตัวอักษร");
      return;
    }

    setLoading(true);

    try {
      await register(email, password, name);
      setSuccess("สมัครสมาชิกสำเร็จ! กรุณารอผู้ดูแลระบบอนุมัติบัญชีของคุณ");
      setName("");
      setEmail("");
      setPassword("");
      setConfirmPassword("");
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
          <h1 className="text-2xl font-bold text-white">
            Judgment registration
          </h1>
          <p className="text-slate-400 mt-1">ทะเบียนคำพิพากษา</p>
        </div>

        {/* Language Switcher */}
        <div className="absolute top-4 right-4">
          <LanguageChanger className="border-white/20 text-white hover:bg-white/10" />
        </div>

        {/* Form */}
        <div className="bg-white rounded-2xl shadow-xl p-8">
          <h2 className="text-xl font-semibold text-slate-900 mb-6">
            {t("register.title")}
          </h2>

          {error && (
            <div className="mb-4 p-3 rounded-xl bg-red-50 border border-red-200 text-red-700 text-sm">
              {error}
            </div>
          )}

          {success && (
            <div className="mb-4 p-3 rounded-xl bg-green-50 border border-green-200 text-green-700 text-sm">
              {success}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="space-y-2">
              <label className={ui.label}>{t("register.name")}</label>
              <input
                type="text"
                className={ui.input}
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder={t("register.name")}
                required
              />
            </div>

            <div className="space-y-2">
              <label className={ui.label}>{t("register.email")}</label>
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
              <label className={ui.label}>{t("register.password")}</label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  className={`${ui.input} pr-10`}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder={t("users.form.password_placeholder")}
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

            <div className="space-y-2">
              <label className={ui.label}>
                {t("register.confirm_password")}
              </label>
              <div className="relative">
                <input
                  type={showConfirmPassword ? "text" : "password"}
                  className={`${ui.input} pr-10`}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder={t("register.confirm_password")}
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 outline-none"
                  tabIndex={-1}
                >
                  {showConfirmPassword ? (
                    <EyeOff size={18} />
                  ) : (
                    <Eye size={18} />
                  )}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className={`${ui.btn} ${ui.btnPrimary} w-full justify-center`}
            >
              {loading ? <IconLoader /> : t("register.submit")}
            </button>
          </form>

          <div className="mt-6 text-center text-sm text-slate-500">
            {t("register.has_account")}{" "}
            <Link
              href="/login"
              className="font-semibold text-blue-600 hover:underline"
            >
              {t("register.login_link")}
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
