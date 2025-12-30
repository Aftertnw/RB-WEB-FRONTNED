"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { deleteJudgment, type Judgment } from "@/lib/api";
import { ui } from "@/app/ui";

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

function IconLoader() {
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
      className="animate-spin"
    >
      <path d="M21 12a9 9 0 1 1-6.219-8.56" />
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

export default function JudgmentDetailClient({ j }: { j: Judgment }) {
  const router = useRouter();
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

  return (
    <>
      <div className="flex items-center gap-2">
        {/* ปุ่มแก้ไข */}
        <Link
          href={`/judgments/${j.id}/edit`}
          className={`${ui.btn} ${ui.btnSoft}`}
        >
          <IconEdit />
          แก้ไข
        </Link>

        {/* ปุ่มลบ */}
        <button
          onClick={() => setShowConfirm(true)}
          disabled={busy}
          className={`${ui.btn} text-red-600 hover:bg-red-50 hover:text-red-700`}
        >
          <IconTrash />
          ลบ
        </button>
      </div>

      {/* Confirm Modal */}
      {showConfirm && (
        <div className="fixed inset-0 z-[70] flex items-center justify-center p-4">
          <div
            className="absolute inset-0 bg-slate-900/50 backdrop-blur-sm"
            onClick={() => !busy && setShowConfirm(false)}
          />

          <div
            className={`${ui.cardElevated} relative w-full max-w-md animate-scaleIn`}
          >
            <div className="p-6">
              <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-red-100">
                <svg
                  width="28"
                  height="28"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="text-red-600"
                >
                  <circle cx="12" cy="12" r="10" />
                  <line x1="12" y1="8" x2="12" y2="12" />
                  <line x1="12" y1="16" x2="12.01" y2="16" />
                </svg>
              </div>

              <div className="mt-4 text-center">
                <h3 className="text-lg font-semibold text-slate-900">
                  ยืนยันการลบ
                </h3>
                <p className="mt-2 text-sm text-slate-500">
                  คุณต้องการลบบันทึก &ldquo;
                  <span className="font-medium text-slate-700">{j.title}</span>
                  &rdquo; หรือไม่? การกระทำนี้ไม่สามารถย้อนกลับได้
                </p>
              </div>
              <div className="mt-6 flex gap-3">
                <button
                  onClick={() => setShowConfirm(false)}
                  disabled={busy}
                  className={`${ui.btn} ${ui.btnGhost} flex-1`}
                >
                  ยกเลิก
                </button>
                <button
                  onClick={onDelete}
                  disabled={busy}
                  className={`${ui.btn} ${ui.btnDanger} flex-1`}
                >
                  {busy ? (
                    <>
                      <IconLoader />
                      กำลังลบ...
                    </>
                  ) : (
                    <>
                      <IconTrash />
                      ยืนยันลบ
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
