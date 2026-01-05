"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { createJudgment } from "@/lib/api";
import { ui } from "@/app/ui";
import { useGlobalLoading } from "@/components/providers/GlobalLoadingProvider";

type FormState = {
  title: string;
  judgment_date: string;
  court: string;
  case_no: string;
  parties: string;
  facts: string;
  issues: string;
  holding: string;
  notes: string;
  tagsText: string;
};

function IconSave() {
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
      <path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z" />
      <polyline points="17,21 17,13 7,13 7,21" />
      <polyline points="7,3 7,8 15,8" />
    </svg>
  );
}

function IconLoader() {
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
      className="animate-spin"
    >
      <path d="M21 12a9 9 0 1 1-6.219-8.56" />
    </svg>
  );
}

function FormSection({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div className="space-y-4">
      <div className="flex items-center gap-3">
        <div className="h-px flex-1 bg-slate-200" />
        <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">
          {title}
        </span>
        <div className="h-px flex-1 bg-slate-200" />
      </div>
      {children}
    </div>
  );
}

export default function NewJudgmentClient() {
  const router = useRouter();
  const [saving, setSaving] = useState(false);
  const { showLoading, hideLoading } = useGlobalLoading();

  const [f, setF] = useState<FormState>({
    title: "",
    judgment_date: "",
    court: "",
    case_no: "",
    parties: "",
    facts: "",
    issues: "",
    holding: "",
    notes: "",
    tagsText: "",
  });

  const tags = useMemo(() => {
    return f.tagsText
      .split(",")
      .map((t) => t.trim())
      .filter(Boolean)
      .slice(0, 20);
  }, [f.tagsText]);

  function set<K extends keyof FormState>(key: K, val: FormState[K]) {
    setF((p) => ({ ...p, [key]: val }));
  }

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!f.title.trim()) {
      alert("กรุณากรอกชื่อเรื่อง");
      return;
    }

    try {
      setSaving(true);
      showLoading("กำลังบันทึก...");

      const payload = {
        title: f.title.trim(),
        judgment_date: f.judgment_date || null,
        court: f.court || null,
        case_no: f.case_no || null,
        parties: f.parties || null,
        facts: f.facts || null,
        issues: f.issues || null,
        holding: f.holding || null,
        notes: f.notes || null,
        tags,
      };

      const r = await createJudgment(payload);
      router.push(`/judgments/${r.id}`);
      router.refresh();
    } catch (err: unknown) {
      alert((err as Error)?.message || "บันทึกไม่สำเร็จ");
    } finally {
      setSaving(false);
    }
  }

  return (
    <form onSubmit={onSubmit} className="space-y-8">
      {/* Basic Info */}
      <FormSection title="ข้อมูลพื้นฐาน">
        <div className="grid gap-5 sm:grid-cols-2">
          <div className="space-y-2 sm:col-span-2">
            <label className={ui.label}>
              ชื่อเรื่อง <span className="text-red-500">*</span>
            </label>
            <input
              className={ui.input}
              value={f.title}
              onChange={(e) => set("title", e.target.value)}
              placeholder="เช่น คดีตัวอย่าง RP..."
            />
          </div>

          <div className="space-y-2">
            <label className={ui.label}>วันที่พิพากษา</label>
            <input
              type="date"
              className={ui.input}
              value={f.judgment_date}
              onChange={(e) => set("judgment_date", e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <label className={ui.label}>ศาล/หน่วยงาน</label>
            <input
              className={ui.input}
              value={f.court}
              onChange={(e) => set("court", e.target.value)}
              placeholder="เช่น ศาลกลางเมือง"
            />
          </div>

          <div className="space-y-2 sm:col-span-2">
            <label className={ui.label}>เลขคดี</label>
            <input
              className={ui.input}
              value={f.case_no}
              onChange={(e) => set("case_no", e.target.value)}
              placeholder="เช่น RP-001"
            />
          </div>
        </div>
      </FormSection>

      {/* Parties */}
      <FormSection title="คู่ความและข้อเท็จจริง">
        <div className="space-y-5">
          <div className="space-y-2">
            <label className={ui.label}>คู่ความ/ผู้เกี่ยวข้อง</label>
            <textarea
              className={ui.textarea}
              value={f.parties}
              onChange={(e) => set("parties", e.target.value)}
              rows={3}
              placeholder="ระบุชื่อคู่ความหรือผู้เกี่ยวข้อง..."
            />
          </div>

          <div className="space-y-2">
            <label className={ui.label}>ข้อเท็จจริง</label>
            <textarea
              className={ui.textarea}
              value={f.facts}
              onChange={(e) => set("facts", e.target.value)}
              rows={5}
              placeholder="บรรยายข้อเท็จจริงของคดี..."
            />
          </div>
        </div>
      </FormSection>

      {/* Legal Issues */}
      <FormSection title="ประเด็นและคำวินิจฉัย">
        <div className="space-y-5">
          <div className="space-y-2">
            <label className={ui.label}>ประเด็นข้อกฎหมาย</label>
            <textarea
              className={ui.textarea}
              value={f.issues}
              onChange={(e) => set("issues", e.target.value)}
              rows={4}
              placeholder="ประเด็นข้อกฎหมายที่ศาลต้องวินิจฉัย..."
            />
          </div>

          <div className="space-y-2">
            <label className={ui.label}>คำวินิจฉัย/ผล</label>
            <textarea
              className={ui.textarea}
              value={f.holding}
              onChange={(e) => set("holding", e.target.value)}
              rows={4}
              placeholder="คำวินิจฉัยและผลของคดี..."
            />
          </div>
        </div>
      </FormSection>

      {/* Notes & Tags */}
      <FormSection title="หมายเหตุและ Tags">
        <div className="space-y-5">
          <div className="space-y-2">
            <label className={ui.label}>หมายเหตุ</label>
            <textarea
              className={ui.textarea}
              value={f.notes}
              onChange={(e) => set("notes", e.target.value)}
              rows={3}
              placeholder="บันทึกเพิ่มเติม..."
            />
          </div>

          <div className="space-y-2">
            <label className={ui.label}>Tags (คั่นด้วย ,)</label>
            <input
              className={ui.input}
              value={f.tagsText}
              onChange={(e) => set("tagsText", e.target.value)}
              placeholder="RP, ทดสอบ, คดีแพ่ง"
            />

            {tags.length > 0 && (
              <div className="flex flex-wrap gap-2 pt-2">
                {tags.map((t) => (
                  <span key={t} className={ui.badgeAccent}>
                    #{t}
                  </span>
                ))}
              </div>
            )}
          </div>
        </div>
      </FormSection>

      {/* Submit */}
      <div
        className="flex items-center justify-end gap-3 border-t pt-6"
        style={{ borderColor: "var(--border)" }}
      >
        <button
          type="button"
          onClick={() => router.back()}
          className={`${ui.btn} ${ui.btnGhost}`}
          disabled={saving}
        >
          ยกเลิก
        </button>
        <button
          type="submit"
          className={`${ui.btn} ${ui.btnAccent} min-w-[140px] shadow-lg shadow-blue-900/20`}
          disabled={saving}
        >
          {saving ? (
            <>
              <IconLoader />
              กำลังบันทึก...
            </>
          ) : (
            <>
              <IconSave />
              บันทึก
            </>
          )}
        </button>
      </div>
    </form>
  );
}
