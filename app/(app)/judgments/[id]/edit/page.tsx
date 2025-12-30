import Link from "next/link";
import { notFound } from "next/navigation";
import { ui } from "@/app/ui";
import { getJudgment } from "@/lib/api";
import EditJudgmentClient from "./edit-client";

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

function IconEdit() {
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
      <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
      <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
    </svg>
  );
}

export default async function Page({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  // ดึงข้อมูลก่อน แล้วค่อย return JSX
  let j;
  try {
    j = await getJudgment(id);
  } catch (e: unknown) {
    const msg = String((e as Error)?.message || "").toLowerCase();
    if (msg.includes("not found") || msg.includes("404")) notFound();
    throw e;
  }

  // JSX อยู่นอก try/catch
  return (
    <div className="space-y-6 stagger-children">
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-sm">
        <Link
          href={`/judgments/${id}`}
          className="flex items-center gap-1.5 text-slate-500 transition hover:text-slate-900"
        >
          <IconArrowLeft />
          กลับรายละเอียด
        </Link>
        <span className="text-slate-300">/</span>
        <span className="text-slate-900 font-medium">แก้ไข</span>
      </div>

      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-4">
          <div className="grid h-14 w-14 place-items-center rounded-2xl bg-gradient-to-br from-amber-500 to-amber-700 text-white shadow-lg shadow-amber-500/25">
            <IconEdit />
          </div>
          <div>
            <h1 className="font-display text-2xl font-semibold tracking-tight text-slate-900">
              แก้ไขบันทึก
            </h1>
            <p className="mt-0.5 text-sm text-slate-500">
              {j.doc_no ? `เลขที่เอกสาร: ${j.doc_no}` : j.title}
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
              แก้ไขข้อมูลคำพิพากษา
            </span>
          </div>
        </div>
        <div className="p-6">
          <EditJudgmentClient judgment={j} />
        </div>
      </div>
    </div>
  );
}
