import Link from "next/link";
import { notFound } from "next/navigation";
import { ui } from "@/app/ui";
import { getJudgment } from "@/lib/api";
import JudgmentDetailClient from "./view-client";

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

export default async function Page({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  try {
    const j = await getJudgment(id);

    return (
      <div className="space-y-6 stagger-children">
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-sm">
          <Link
            href="/judgments"
            className="flex items-center gap-1.5 text-slate-500 transition hover:text-slate-900"
          >
            <IconArrowLeft />
            กลับรายการ
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
                  เลขที่เอกสาร: {j.doc_no}
                </div>
              )}

              <h1 className="text-2xl font-semibold sm:text-3xl">{j.title}</h1>

              <div className="mt-4 flex flex-wrap gap-4 text-sm text-white/70">
                {j.judgment_date && (
                  <div className="flex items-center gap-1.5">
                    <IconCalendar />
                    {j.judgment_date}
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
                    เลขคดี: {j.case_no}
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
              สร้างเมื่อ:{" "}
              {j.created_at
                ? new Date(j.created_at).toLocaleString("th-TH")
                : "-"}
            </div>
            <JudgmentDetailClient j={j} />
          </div>

          {/* Content */}
          <div
            className="divide-y p-6"
            style={{ borderColor: "var(--border)" }}
          >
            <div className="grid gap-8 pb-6 sm:grid-cols-2">
              <DetailSection
                title="คู่ความ/ผู้เกี่ยวข้อง"
                content={j.parties}
              />
            </div>

            {j.facts && (
              <div className="py-6">
                <DetailSection title="ข้อเท็จจริง" content={j.facts} />
              </div>
            )}

            {j.issues && (
              <div className="py-6">
                <DetailSection title="ประเด็นข้อกฎหมาย" content={j.issues} />
              </div>
            )}

            {j.holding && (
              <div className="py-6">
                <div className="rounded-xl bg-amber-50 p-5 border border-amber-200/50">
                  <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-amber-700">
                    <span className="h-2 w-2 rounded-full bg-amber-500" />
                    คำวินิจฉัย/ผล
                  </div>
                  <div className="mt-3 whitespace-pre-wrap text-sm leading-relaxed text-amber-900">
                    {j.holding}
                  </div>
                </div>
              </div>
            )}

            {j.notes && (
              <div className="pt-6">
                <DetailSection title="หมายเหตุ" content={j.notes} />
              </div>
            )}

            {/* Empty state if no content */}
            {!j.parties && !j.facts && !j.issues && !j.holding && !j.notes && (
              <div className="py-12 text-center text-slate-500">
                <p>ยังไม่มีรายละเอียดเพิ่มเติม</p>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  } catch (e: unknown) {
    const msg = String((e as Error)?.message || "").toLowerCase();
    if (msg.includes("not found") || msg.includes("404")) notFound();
    throw e;
  }
}
