import { ui } from "@/app/ui";
import Link from "next/link";
import NewJudgmentClient from "./new-client";

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

function IconFileText() {
  return (
    <svg
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
      <polyline points="14,2 14,8 20,8" />
      <line x1="16" y1="13" x2="8" y2="13" />
      <line x1="16" y1="17" x2="8" y2="17" />
      <line x1="10" y1="9" x2="8" y2="9" />
    </svg>
  );
}

export default function Page() {
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
        <span className="text-slate-900 font-medium">เพิ่มบันทึกใหม่</span>
      </div>

      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-4">
          <div className="grid h-14 w-14 place-items-center rounded-2xl bg-gradient-to-br from-blue-500 to-blue-700 text-white shadow-lg shadow-blue-500/25">
            <IconFileText />
          </div>
          <div>
            <h1 className="text-2xl font-semibold tracking-tight text-slate-900">
              เพิ่มบันทึกคำพิพากษา
            </h1>
            <p className="mt-0.5 text-sm text-slate-500">
              กรอกข้อมูล แล้วกดบันทึก ระบบจะสร้างเลขที่เอกสารให้อัตโนมัติ
            </p>
          </div>
        </div>
      </div>

      {/* Form Card */}
      <div className={ui.cardElevated}>
        <div
          className="border-b px-6 py-4"
          style={{ borderColor: "var(--border)" }}
        >
          <div className="flex items-center gap-2">
            <span className="h-2 w-2 rounded-full bg-amber-500" />
            <span className="text-sm font-semibold text-slate-700">
              ข้อมูลคำพิพากษา
            </span>
          </div>
        </div>

        <div className="p-6">
          <NewJudgmentClient />
        </div>
      </div>
    </div>
  );
}
