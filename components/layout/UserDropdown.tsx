"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/auth";
import { User, Settings, LogOut, ChevronDown } from "lucide-react";

export default function UserDropdown() {
  const router = useRouter();
  const { user, logout, loading } = useAuth();

  const [open, setOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  if (loading) {
    return (
      <div className="h-10 w-10 rounded-full bg-slate-200 animate-pulse" />
    );
  }

  if (!user) {
    return (
      <Link
        href="/login"
        className="inline-flex items-center gap-2 rounded-xl bg-slate-900 px-4 py-2 text-sm font-semibold text-white transition hover:bg-slate-800"
      >
        เข้าสู่ระบบ
      </Link>
    );
  }

  const initials = user.name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);

  function handleLogout() {
    logout();
    router.push("/login");
  }

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setOpen(!open)}
        className="flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-3 py-2 transition hover:bg-slate-50"
      >
        {user.avatar_url ? (
          <img
            src={user.avatar_url}
            alt={user.name}
            className="h-8 w-8 rounded-full object-cover"
          />
        ) : (
          <div className="grid h-8 w-8 place-items-center rounded-full bg-gradient-to-br from-blue-500 to-blue-700 text-xs font-bold text-white">
            {initials}
          </div>
        )}
        <div className="hidden sm:block text-left">
          <div className="text-sm font-semibold text-slate-900">
            {user.name}
          </div>
          <div className="text-xs text-slate-500">{user.role}</div>
        </div>
        <ChevronDown className="h-4 w-4 text-slate-400" />
      </button>

      {open && (
        <div
          className="absolute right-0 top-full mt-2 w-56 rounded-xl border bg-white shadow-lg z-50 overflow-hidden"
          style={{ borderColor: "var(--border)" }}
        >
          <div
            className="p-4 border-b bg-slate-50/50"
            style={{ borderColor: "var(--border)" }}
          >
            <div className="font-semibold text-slate-900">{user.name}</div>
            <div className="text-xs text-slate-500 truncate">{user.email}</div>
          </div>

          <div className="p-1.5">
            <Link
              href="/profile"
              onClick={() => setOpen(false)}
              className="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-50"
            >
              <User className="h-4 w-4 text-slate-400" />
              User Profile
            </Link>
          </div>

          <div className="h-px bg-slate-100 my-1" />

          <div className="p-1.5 pt-0">
            <button
              onClick={handleLogout}
              className="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium text-red-600 transition hover:bg-red-50"
            >
              <LogOut className="h-4 w-4" />
              Logout
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
