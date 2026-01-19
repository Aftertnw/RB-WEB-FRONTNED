"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { updateJudgment, type Judgment } from "@/lib/api";
import { ui } from "@/app/ui";
import { useGlobalLoading } from "@/components/providers/GlobalLoadingProvider";
import { useTranslation } from "react-i18next";
import Link from "next/link";

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

export default function EditJudgmentClient({
  judgment,
}: {
  judgment: Judgment;
}) {
  const router = useRouter();
  const [saving, setSaving] = useState(false);
  const { showLoading, hideLoading } = useGlobalLoading();
  const { t } = useTranslation();

  const [f, setF] = useState<FormState>({
    title: judgment.title || "",
    judgment_date: judgment.judgment_date || "",
    court: judgment.court || "",
    case_no: judgment.case_no || "",
    parties: judgment.parties || "",
    facts: judgment.facts || "",
    issues: judgment.issues || "",
    holding: judgment.holding || "",
    notes: judgment.notes || "",
    tagsText: judgment.tags?.join(", ") || "",
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
      showLoading(t("judgments.form.saving"));

      await updateJudgment(judgment.id, {
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
      });

      router.push(`/judgments/${judgment.id}`);
      router.refresh();
    } catch (err: unknown) {
      alert((err as Error)?.message || "บันทึกไม่สำเร็จ");
    } finally {
      hideLoading();
      setSaving(false);
    }
  }

  return (
    <div className="space-y-6 stagger-children">
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-sm">
        <Link
          href={`/judgments/${judgment.id}`}
          className="flex items-center gap-1.5 text-slate-500 transition hover:text-slate-900"
        >
          <IconArrowLeft />
          {t("judgments.form.back_detail")}
        </Link>
        <span className="text-slate-300">/</span>
        <span className="text-slate-900 font-medium">{t("common.edit")}</span>
      </div>

      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-4">
          <div className="grid h-14 w-14 place-items-center rounded-2xl bg-gradient-to-br from-amber-500 to-amber-700 text-white shadow-lg shadow-amber-500/25">
            <IconEdit />
          </div>
          <div>
            <h1 className="font-display text-2xl font-semibold tracking-tight text-slate-900">
              {t("judgments.form.edit_page_title")}
            </h1>
            <p className="mt-0.5 text-sm text-slate-500">
              {judgment.doc_no
                ? `${t("judgments.detail.doc_no_label")} ${judgment.doc_no}`
                : judgment.title}
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
              {t("judgments.form.basic_info")}
            </span>
          </div>
        </div>
        <div className="p-6">
          <form onSubmit={onSubmit} className="space-y-8">
            <FormSection title={t("judgments.form.basic_info")}>
              <div className="grid gap-5 sm:grid-cols-2">
                <div className="space-y-2 sm:col-span-2">
                  <label className={ui.label}>
                    {t("judgments.form.title_label")}{" "}
                    <span className="text-red-500">*</span>
                  </label>
                  <input
                    className={ui.input}
                    value={f.title}
                    onChange={(e) => set("title", e.target.value)}
                    placeholder={t("judgments.form.title_placeholder")}
                  />
                </div>
                <div className="space-y-2">
                  <label className={ui.label}>
                    {t("judgments.form.date_label")}
                  </label>
                  <input
                    type="date"
                    className={ui.input}
                    value={f.judgment_date}
                    onChange={(e) => set("judgment_date", e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <label className={ui.label}>
                    {t("judgments.form.court_label")}
                  </label>
                  <input
                    className={ui.input}
                    value={f.court}
                    onChange={(e) => set("court", e.target.value)}
                    placeholder={t("judgments.form.court_placeholder")}
                  />
                </div>
                <div className="space-y-2 sm:col-span-2">
                  <label className={ui.label}>
                    {t("judgments.form.case_no_label")}
                  </label>
                  <input
                    className={ui.input}
                    value={f.case_no}
                    onChange={(e) => set("case_no", e.target.value)}
                    placeholder={t("judgments.form.case_no_placeholder")}
                  />
                </div>
              </div>
            </FormSection>

            <FormSection title={t("judgments.form.facts_section")}>
              <div className="space-y-5">
                <div className="space-y-2">
                  <label className={ui.label}>
                    {t("judgments.form.parties_label")}
                  </label>
                  <textarea
                    className={ui.textarea}
                    value={f.parties}
                    onChange={(e) => set("parties", e.target.value)}
                    rows={3}
                    placeholder={t("judgments.form.parties_placeholder")}
                  />
                </div>
                <div className="space-y-2">
                  <label className={ui.label}>
                    {t("judgments.form.facts_label")}
                  </label>
                  <textarea
                    className={ui.textarea}
                    value={f.facts}
                    onChange={(e) => set("facts", e.target.value)}
                    rows={5}
                    placeholder={t("judgments.form.facts_placeholder")}
                  />
                </div>
              </div>
            </FormSection>

            <FormSection title={t("judgments.form.issues_section")}>
              <div className="space-y-5">
                <div className="space-y-2">
                  <label className={ui.label}>
                    {t("judgments.form.issues_label")}
                  </label>
                  <textarea
                    className={ui.textarea}
                    value={f.issues}
                    onChange={(e) => set("issues", e.target.value)}
                    rows={4}
                    placeholder={t("judgments.form.issues_placeholder")}
                  />
                </div>
                <div className="space-y-2">
                  <label className={ui.label}>
                    {t("judgments.form.holding_label")}
                  </label>
                  <textarea
                    className={ui.textarea}
                    value={f.holding}
                    onChange={(e) => set("holding", e.target.value)}
                    rows={4}
                    placeholder={t("judgments.form.holding_placeholder")}
                  />
                </div>
              </div>
            </FormSection>

            <FormSection title={t("judgments.form.notes_section")}>
              <div className="space-y-5">
                <div className="space-y-2">
                  <label className={ui.label}>
                    {t("judgments.form.notes_label")}
                  </label>
                  <textarea
                    className={ui.textarea}
                    value={f.notes}
                    onChange={(e) => set("notes", e.target.value)}
                    rows={3}
                    placeholder={t("judgments.form.notes_placeholder")}
                  />
                </div>
                <div className="space-y-2">
                  <label className={ui.label}>
                    {t("judgments.form.tags_label")}
                  </label>
                  <input
                    className={ui.input}
                    value={f.tagsText}
                    onChange={(e) => set("tagsText", e.target.value)}
                    placeholder={t("judgments.form.tags_placeholder")}
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
                {t("common.cancel")}
              </button>
              <button
                type="submit"
                className={`${ui.btn} ${ui.btnAccent} min-w-[160px] shadow-lg shadow-blue-900/20`}
                disabled={saving}
              >
                {saving ? (
                  <>
                    <IconLoader />
                    {t("judgments.form.saving")}
                  </>
                ) : (
                  <>
                    <IconSave />
                    {t("common.save")}
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
