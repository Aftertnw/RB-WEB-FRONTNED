"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { deleteJudgment, type Judgment } from "@/lib/api";
import { ui } from "@/app/ui";
import { ConfirmModal } from "@/components/modal/ConfirmModal";
import { useTranslation } from "react-i18next";

function IconTrash() {
  return (
    <svg
      width="14"
      height="14"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <polyline points="3,6 5,6 21,6" />
      <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
      <line x1="10" y1="11" x2="10" y2="17" />
      <line x1="14" y1="11" x2="14" y2="17" />
    </svg>
  );
}

function IconEdit() {
  return (
    <svg
      width="14"
      height="14"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
      <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
    </svg>
  );
}

function IconArrowLeft() {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="m12 19-7-7 7-7" />
      <path d="M19 12H5" />
    </svg>
  );
}

function IconCalendar() {
  return (
    <svg
      width="14"
      height="14"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
      <line x1="16" y1="2" x2="16" y2="6" />
      <line x1="8" y1="2" x2="8" y2="6" />
      <line x1="3" y1="10" x2="21" y2="10" />
    </svg>
  );
}

function IconBuilding() {
  return (
    <svg
      width="14"
      height="14"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M6 22V4a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v18Z" />
      <path d="M6 12H4a2 2 0 0 0-2 2v6a2 2 0 0 0 2 2h2" />
      <path d="M18 9h2a2 2 0 0 1 2 2v9a2 2 0 0 1-2 2h-2" />
      <path d="M10 6h4" />
      <path d="M10 10h4" />
      <path d="M10 14h4" />
      <path d="M10 18h4" />
    </svg>
  );
}

function IconFileText() {
  return (
    <svg
      width="14"
      height="14"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
      <polyline points="14,2 14,8 20,8" />
      <line x1="16" y1="13" x2="8" y2="13" />
      <line x1="16" y1="17" x2="8" y2="17" />
    </svg>
  );
}

function DetailSection({
  title,
  content,
  icon,
}: {
  title: string;
  content: string | null | undefined;
  icon?: React.ReactNode;
}) {
  if (!content) return null;

  return (
    <div className="space-y-2">
      <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-slate-400">
        {icon}
        {title}
      </div>
      <div className="whitespace-pre-wrap text-sm leading-relaxed text-slate-700">
        {content}
      </div>
    </div>
  );
}

export default function JudgmentDetailView({ j }: { j: Judgment }) {
  const router = useRouter();
  const { t, i18n } = useTranslation();
  const [busy, setBusy] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  async function onDelete() {
    try {
      setBusy(true);
      await deleteJudgment(j.id);
      router.push("/judgments");
      router.refresh();
    } finally {
      setBusy(false);
      setShowConfirm(false);
    }
  }

  // Format date using current locale
  const formatDate = (dateString?: string) => {
    if (!dateString) return "-";
    return new Date(dateString).toLocaleDateString(
      i18n.language === "th" ? "th-TH" : "en-US",
      {
        year: "numeric",
        month: "long",
        day: "numeric",
      },
    );
  };

  const formatDateTime = (dateString?: string) => {
    if (!dateString) return "-";
    return new Date(dateString).toLocaleString(
      i18n.language === "th" ? "th-TH" : "en-US",
      {
        year: "numeric",
        month: "short",
        day: "numeric",
        hour: "numeric",
        minute: "numeric",
      },
    );
  };

  return (
    <div className="space-y-6 stagger-children">
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-sm">
        <Link
          href="/judgments"
          className="flex items-center gap-1.5 text-slate-500 transition hover:text-slate-900"
        >
          <IconArrowLeft />
          {t("judgments.detail.back")}
        </Link>
        <span className="text-slate-300">/</span>
        <span className="text-slate-900 font-medium truncate max-w-[200px]">
          {j.title}
        </span>
      </div>

      {/* Header Card */}
      <div className={`${ui.cardElevated} overflow-hidden`}>
        {/* Title section with gradient */}
        <div className="relative bg-gradient-to-r from-slate-800 to-slate-900 px-6 py-8 text-white">
          <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGRlZnM+PHBhdHRlcm4gaWQ9ImdyaWQiIHdpZHRoPSI0MCIgaGVpZ2h0PSI0MCIgcGF0dGVyblVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+PHBhdGggZD0iTSAwIDEwIEwgNDAgMTAgTSAxMCAwIEwgMTAgNDAgTSAwIDIwIEwgNDAgMjAgTSAyMCAwIEwgMjAgNDAgTSAwIDMwIEwgNDAgMzAgTSAzMCAwIEwgMzAgNDAiIGZpbGw9Im5vbmUiIHN0cm9rZT0iI2ZmZiIgc3Ryb2tlLW9wYWNpdHk9IjAuMDMiIHN0cm9rZS13aWR0aD0iMSIvPjwvcGF0dGVybj48L2RlZnM+PHJlY3Qgd2lkdGg9IjEwMCUiIGhlaWdodD0iMTAwJSIgZmlsbD0idXJsKCNncmlkKSIvPjwvc3ZnPg==')] opacity-50" />

          <div className="relative">
            {j.doc_no && (
              <div className="mb-3 inline-flex items-center gap-2 rounded-full bg-white/10 px-3 py-1 text-xs font-medium text-white/80 backdrop-blur">
                <IconFileText />
                {t("judgments.detail.doc_no_label")} {j.doc_no}
              </div>
            )}

            <h1 className="text-2xl font-semibold sm:text-3xl">{j.title}</h1>

            <div className="mt-4 flex flex-wrap gap-4 text-sm text-white/70">
              {j.judgment_date && (
                <div className="flex items-center gap-1.5">
                  <IconCalendar />
                  {formatDate(j.judgment_date)}
                </div>
              )}
              {j.court && (
                <div className="flex items-center gap-1.5">
                  <IconBuilding />
                  {j.court}
                </div>
              )}
              {j.case_no && (
                <div className="flex items-center gap-1.5">
                  <IconFileText />
                  {t("judgments.detail.case_no_label")} {j.case_no}
                </div>
              )}
            </div>

            {j.tags?.length > 0 && (
              <div className="mt-4 flex flex-wrap gap-2">
                {j.tags.map((t) => (
                  <span
                    key={t}
                    className="rounded-full bg-white/10 px-3 py-1 text-xs font-medium text-white/90 backdrop-blur"
                  >
                    #{t}
                  </span>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Actions */}
        <div
          className="flex items-center justify-between border-b bg-slate-50/50 px-6 py-3"
          style={{ borderColor: "var(--border)" }}
        >
          <div className="text-xs text-slate-500">
            {t("judgments.detail.created_at_label")}{" "}
            {formatDateTime(j.created_at)}
          </div>
          <div className="flex items-center gap-2">
            <Link
              href={`/judgments/${j.id}/edit`}
              className={`${ui.btn} ${ui.btnSoft}`}
            >
              <IconEdit />
              {t("common.edit")}
            </Link>

            <button
              onClick={() => setShowConfirm(true)}
              disabled={busy}
              className={`${ui.btn} text-red-600 hover:bg-red-50 hover:text-red-700`}
            >
              <IconTrash />
              {t("common.delete")}
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="divide-y p-6" style={{ borderColor: "var(--border)" }}>
          <div className="grid gap-8 pb-6 sm:grid-cols-2">
            <DetailSection
              title={t("judgments.detail.parties")}
              content={j.parties}
            />
          </div>

          {j.facts && (
            <div className="py-6">
              <DetailSection
                title={t("judgments.detail.facts")}
                content={j.facts}
              />
            </div>
          )}

          {j.issues && (
            <div className="py-6">
              <DetailSection
                title={t("judgments.detail.issues")}
                content={j.issues}
              />
            </div>
          )}

          {j.holding && (
            <div className="py-6">
              <div className="rounded-xl bg-amber-50 p-5 border border-amber-200/50">
                <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-amber-700">
                  <span className="h-2 w-2 rounded-full bg-amber-500" />
                  {t("judgments.detail.holding")}
                </div>
                <div className="mt-3 whitespace-pre-wrap text-sm leading-relaxed text-amber-900">
                  {j.holding}
                </div>
              </div>
            </div>
          )}

          {j.notes && (
            <div className="pt-6">
              <DetailSection
                title={t("judgments.detail.notes")}
                content={j.notes}
              />
            </div>
          )}

          {/* Empty state if no content */}
          {!j.parties && !j.facts && !j.issues && !j.holding && !j.notes && (
            <div className="py-12 text-center text-slate-500">
              <p>{t("judgments.detail.no_content")}</p>
            </div>
          )}
        </div>
      </div>

      <ConfirmModal
        open={showConfirm}
        title={t("dialog.delete_judgment.title")}
        message={t("dialog.delete_judgment.message_with_title", {
          title: j.title,
        })}
        onConfirm={onDelete}
        onClose={() => setShowConfirm(false)}
        danger={true}
        loading={busy}
      />
    </div>
  );
}
