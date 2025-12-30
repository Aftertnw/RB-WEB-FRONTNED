"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import React, { useMemo, useState } from "react";
import UserDropdown from "./UserDropdown";
import { useAuth } from "@/lib/auth";

type NavItem = {
  href: string;
  label: string;
  icon: React.ReactNode;
  badge?: string;
};

function NavLink({
  href,
  label,
  icon,
  badge,
  onClick,
}: NavItem & { onClick?: () => void }) {
  const pathname = usePathname();
  const active = pathname === href || pathname.startsWith(href + "/");

  return (
    <Link
      href={href}
      onClick={onClick}
      className={[
        "group flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-all duration-200",
        active
          ? "bg-white/10 text-white shadow-sm"
          : "text-slate-400 hover:bg-white/5 hover:text-slate-200",
      ].join(" ")}
    >
      <span
        className={[
          "grid h-9 w-9 place-items-center rounded-lg transition-all duration-200",
          active
            ? "bg-white/20 text-white"
            : "bg-transparent text-slate-400 group-hover:bg-white/10 group-hover:text-slate-200",
        ].join(" ")}
      >
        {icon}
      </span>
      <span className="flex-1 truncate">{label}</span>
      {badge && (
        <span className="rounded-full bg-amber-500/20 px-2 py-0.5 text-[10px] font-semibold text-amber-400">
          {badge}
        </span>
      )}
    </Link>
  );
}

function IconBook() {
  return (
    <svg
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M4 19.5v-15A2.5 2.5 0 0 1 6.5 2H20v20H6.5a2.5 2.5 0 0 1 0-5H20" />
      <path d="M8 7h6" />
      <path d="M8 11h8" />
    </svg>
  );
}

function IconPlus() {
  return (
    <svg
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
    >
      <path d="M12 5v14M5 12h14" />
    </svg>
  );
}

function IconChart() {
  return (
    <svg
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M3 3v18h18" />
      <path d="M18 17V9" />
      <path d="M13 17V5" />
      <path d="M8 17v-3" />
    </svg>
  );
}

function IconMenu() {
  return (
    <svg
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
    >
      <path d="M4 6h16M4 12h16M4 18h16" />
    </svg>
  );
}

function IconUsers() {
  return (
    <svg
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
      <circle cx="9" cy="7" r="4" />
      <path d="M22 21v-2a4 4 0 0 0-3-3.87" />
      <path d="M16 3.13a4 4 0 0 1 0 7.75" />
    </svg>
  );
}

function IconClose() {
  return (
    <svg
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
    >
      <path d="M18 6 6 18M6 6l12 12" />
    </svg>
  );
}

function IconScale() {
  return (
    <svg
      width="24"
      height="24"
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

// ย้ายออกมานอก AppShell
function SidebarContent({
  nav,
  onNavClick,
}: {
  nav: NavItem[];
  onNavClick?: () => void;
}) {
  return (
    <>
      {/* Logo */}
      <div className="px-4 py-6">
        <div className="flex items-center gap-3">
          <div className="grid h-11 w-11 place-items-center rounded-xl bg-gradient-to-br from-amber-400 to-amber-600 text-slate-900 shadow-lg">
            <IconScale />
          </div>
          <div>
            <div className="text-[11px] font-medium uppercase tracking-wider text-slate-500">
              Judgment Notes
            </div>
            <div className="text-base font-semibold text-white">
              ทะเบียนคำพิพากษา
            </div>
          </div>
        </div>
      </div>

      {/* Nav */}
      <div className="flex-1 px-3">
        <div className="mb-2 px-3 text-[10px] font-semibold uppercase tracking-wider text-slate-500">
          เมนูหลัก
        </div>
        <nav className="space-y-1">
          {nav.map((n) => (
            <NavLink key={n.href} {...n} onClick={onNavClick} />
          ))}
        </nav>
      </div>

      {/* Bottom card */}
      <div className="p-4">
        <div className="rounded-xl bg-white/5 p-4 backdrop-blur">
          <div className="flex items-center gap-2 text-sm font-semibold text-white">
            <span className="h-2 w-2 rounded-full bg-emerald-400 shadow-lg shadow-emerald-400/50" />
            ระบบพร้อมใช้งาน
          </div>
          <div className="mt-2 text-xs leading-relaxed text-slate-400">
            ใช้ช่องค้นหาบนหน้าทะเบียนเพื่อกรองข้อมูลจากเลขเอกสาร ชื่อเรื่อง
            หรือศาล
          </div>
        </div>
      </div>
    </>
  );
}

export default function AppShell({ children }: { children: React.ReactNode }) {
  const [open, setOpen] = useState(false);

  const { user } = useAuth();

  const nav: NavItem[] = useMemo(() => {
    const items = [
      {
        href: "/dashboard",
        label: "แดชบอร์ด",
        icon: <IconChart />,
        badge: "เร็วๆนี้",
      },
      { href: "/judgments", label: "ทะเบียนคำพิพากษา", icon: <IconBook /> },
    ];

    if (user?.role === "admin") {
      items.push({
        href: "/users",
        label: "จัดการผู้ใช้งาน",
        icon: <IconUsers />,
      });
    }

    return items;
  }, [user?.role]);

  return (
    <div className="flex min-h-screen">
      {/* Desktop Sidebar */}
      <aside className="hidden lg:flex lg:w-[280px] lg:flex-col lg:fixed lg:inset-y-0 z-50">
        <div
          className="flex flex-1 flex-col overflow-y-auto"
          style={{
            background: "linear-gradient(180deg, #1e293b 0%, #0f172a 100%)",
          }}
        >
          <SidebarContent nav={nav} />
        </div>
      </aside>

      {/* Main area */}
      <div className="flex-1 lg:pl-[280px]">
        {/* Desktop Header */}
        <header className="hidden lg:flex h-16 items-center justify-between border-b bg-white/50 px-8 backdrop-blur z-40 sticky top-0">
          <div className="flex items-center gap-4">
            {/* Breadcrumbs or Page Title could go here */}
          </div>
          <div className="flex items-center gap-3">
            <UserDropdown />
          </div>
        </header>

        {/* Mobile header */}
        <header className="sticky top-0 z-40 lg:hidden">
          <div className="flex h-16 items-center gap-4 border-b bg-white/95 px-4 backdrop-blur supports-[backdrop-filter]:bg-white/80">
            <button
              onClick={() => setOpen(true)}
              className="grid h-10 w-10 place-items-center rounded-xl border border-slate-200 text-slate-600 transition hover:bg-slate-50"
              aria-label="เปิดเมนู"
            >
              <IconMenu />
            </button>

            <div className="flex items-center gap-2.5">
              <div className="grid h-9 w-9 place-items-center rounded-lg bg-gradient-to-br from-amber-400 to-amber-600 text-slate-900">
                <IconScale />
              </div>
              <div className="font-semibold text-slate-900">
                ทะเบียนคำพิพากษา
              </div>
            </div>

            <div className="ml-auto flex items-center gap-3">
              <Link
                href="/judgments/new"
                className="hidden sm:inline-flex items-center gap-2 rounded-xl bg-slate-900 px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-slate-800"
              >
                <IconPlus />
                เพิ่มบันทึก
              </Link>
              <UserDropdown />
            </div>
          </div>
        </header>

        {/* Page content */}
        <main className="min-h-screen bg-[var(--bg)]">
          <div className="mx-auto max-w-6xl px-4 py-6 sm:px-6 lg:px-8 lg:py-8">
            {children}
          </div>

          <footer className="border-t bg-white/50 px-4 py-6 text-center text-xs text-slate-500">
            © {new Date().getFullYear()} Judgment Notes • Made by Major General
            After39
          </footer>
        </main>
      </div>

      {/* Mobile drawer */}
      {open && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div
            className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm"
            onClick={() => setOpen(false)}
          />
          <div
            className="absolute left-0 top-0 flex h-full w-[300px] max-w-[85vw] flex-col animate-slideIn"
            style={{
              background: "linear-gradient(180deg, #1e293b 0%, #0f172a 100%)",
            }}
          >
            <button
              onClick={() => setOpen(false)}
              className="absolute right-3 top-5 grid h-9 w-9 place-items-center rounded-lg text-slate-400 transition hover:bg-white/10 hover:text-white"
              aria-label="ปิดเมนู"
            >
              <IconClose />
            </button>
            <SidebarContent nav={nav} onNavClick={() => setOpen(false)} />
          </div>
        </div>
      )}
    </div>
  );
}
