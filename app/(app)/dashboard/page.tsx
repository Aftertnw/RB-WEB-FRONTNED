"use client";

import { useAuth } from "@/lib/auth";
import { getDashboardStats, DashboardStats } from "@/lib/api";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { Scale, Users, UserCheck, UserPlus, Activity } from "lucide-react";
import Link from "next/link";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend,
} from "recharts";

const COLORS = ["#d97706", "#2563eb", "#059669", "#ea580c", "#64748b"];

function StatCard({
  title,
  value,
  icon: Icon,
  colorClass,
  href,
}: {
  title: string;
  value: number | string;
  icon: any;
  colorClass: string;
  href?: string;
}) {
  const content = (
    <div className="group relative overflow-hidden rounded-3xl bg-white p-6 shadow-sm transition-all duration-300 hover:shadow-xl hover:-translate-y-1 border border-slate-100">
      <div
        className={`absolute right-4 top-4 rounded-2xl p-3.5 transition-transform duration-300 group-hover:scale-110 ${colorClass}`}
      >
        <Icon size={24} />
      </div>
      <div className="relative z-10">
        <p className="text-sm font-semibold text-slate-500 uppercase tracking-wide">
          {title}
        </p>
        <p className="mt-3 text-4xl font-extrabold text-slate-900 tracking-tight">
          {value}
        </p>
      </div>
      {/* Decorative gradient blob */}
      <div
        className={`absolute -bottom-4 -right-4 h-24 w-24 rounded-full opacity-10 blur-2xl transition-all duration-500 group-hover:opacity-20 ${colorClass.split(" ")[0].replace("text-", "bg-")}`}
      />
    </div>
  );

  if (href) {
    return (
      <Link href={href} className="block">
        {content}
      </Link>
    );
  }

  return content;
}

export default function DashboardPage() {
  const { user } = useAuth();
  const { t } = useTranslation();
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadStats() {
      try {
        const data = await getDashboardStats();
        setStats(data);
      } catch (err) {
        console.error("Failed to load dashboard stats", err);
      } finally {
        setLoading(false);
      }
    }
    loadStats();
  }, []);

  if (loading) {
    return (
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4 animate-pulse">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="h-32 rounded-3xl bg-slate-200/50" />
        ))}
      </div>
    );
  }

  if (!stats) return null;

  return (
    <div className="space-y-8 pb-10">
      <div>
        <h1 className="text-3xl font-bold text-slate-900 tracking-tight">
          {t("sidebar.dashboard")}
        </h1>
        <p className="text-slate-500 mt-2 text-lg">
          {t("sidebar.search_hint")}
        </p>
      </div>

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {/* All Users see Judgment Stats */}
        <StatCard
          title={t("sidebar.judgments")}
          value={stats.total_judgments}
          icon={Scale}
          colorClass="text-amber-600 bg-amber-50"
          href="/judgments"
        />

        {/* Admin and Owner stats */}
        {(user?.role === "admin" || user?.role === "owner") && (
          <>
            <StatCard
              title={t("dashboard.total_users")}
              value={stats.total_users || 0}
              icon={Users}
              colorClass="text-blue-600 bg-blue-50"
              href="/users"
            />
            <StatCard
              title={t("dashboard.active_users")}
              value={stats.active_users || 0}
              icon={UserCheck}
              colorClass="text-emerald-600 bg-emerald-50"
              href="/users?tab=active"
            />
            <StatCard
              title={t("dashboard.pending_users")}
              value={stats.pending_users || 0}
              icon={UserPlus}
              colorClass="text-orange-600 bg-orange-50"
              href="/users?tab=pending"
            />
          </>
        )}
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
        {/* Bar Chart: 5 Year Trend */}
        <div className="rounded-3xl bg-white p-8 shadow-sm border border-slate-100">
          <h2 className="mb-6 text-xl font-bold text-slate-900">
            {t("dashboard.chart_trend_title")}
          </h2>
          <div className="h-80 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={stats.yearly_stats || []}>
                <CartesianGrid
                  strokeDasharray="3 3"
                  vertical={false}
                  stroke="#e2e8f0"
                />
                <XAxis
                  dataKey="year"
                  axisLine={false}
                  tickLine={false}
                  tick={{ fill: "#64748b", fontSize: 12 }}
                  dy={10}
                />
                <YAxis
                  axisLine={false}
                  tickLine={false}
                  tick={{ fill: "#64748b", fontSize: 12 }}
                />
                <Tooltip
                  cursor={{ fill: "#f1f5f9" }}
                  contentStyle={{
                    borderRadius: "12px",
                    border: "none",
                    boxShadow: "0 4px 6px -1px rgb(0 0 0 / 0.1)",
                  }}
                />
                <Bar
                  dataKey="count"
                  fill="#d97706"
                  radius={[6, 6, 0, 0]}
                  name={t("sidebar.judgments")}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Stats List: Contributors (Admin) vs Offenders (User) */}
        <div className="rounded-3xl bg-white p-8 shadow-sm border border-slate-100 flex flex-col">
          <h2 className="mb-6 text-xl font-bold text-slate-900">
            {user?.role === "admin" || user?.role === "owner"
              ? t("dashboard.chart_contributor_title")
              : t("dashboard.chart_court_title")}
          </h2>
          <div className="flex-1 overflow-y-auto pr-2">
            <div className="space-y-4">
              {/* Admin View: Contributors */}
              {(user?.role === "admin" || user?.role === "owner") &&
                (stats.contributor_stats || []).map((item, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between p-4 rounded-2xl bg-slate-50 border border-slate-100 transition-colors hover:bg-slate-100"
                  >
                    <div className="flex items-center gap-4">
                      <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white shadow-sm text-slate-600 font-bold border border-slate-100">
                        {index + 1}
                      </div>
                      <span className="font-medium text-slate-700 text-lg">
                        {item.name}
                      </span>
                    </div>
                    <div className="bg-white px-4 py-1.5 rounded-lg border border-slate-100 font-bold text-slate-900 shadow-sm">
                      {item.count}
                    </div>
                  </div>
                ))}

              {/* User View: Offenders (Court/Parties) */}
              {user?.role !== "admin" &&
                user?.role !== "owner" &&
                (stats.court_stats || []).map((item, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between p-4 rounded-2xl bg-slate-50 border border-slate-100 transition-colors hover:bg-slate-100"
                  >
                    <div className="flex items-center gap-4">
                      <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white shadow-sm text-slate-600 font-bold border border-slate-100">
                        {index + 1}
                      </div>
                      <span className="font-medium text-slate-700 text-lg">
                        {item.court}
                      </span>
                    </div>
                    <div className="bg-white px-4 py-1.5 rounded-lg border border-slate-100 font-bold text-slate-900 shadow-sm">
                      {item.count}
                    </div>
                  </div>
                ))}

              {/* Empty States */}
              {((user?.role === "admin" || user?.role === "owner") &&
                (!stats.contributor_stats ||
                  stats.contributor_stats.length === 0)) ||
              (user?.role !== "admin" &&
                user?.role !== "owner" &&
                (!stats.court_stats || stats.court_stats.length === 0)) ? (
                <div className="text-center text-slate-400 py-10">
                  No data available
                </div>
              ) : null}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
