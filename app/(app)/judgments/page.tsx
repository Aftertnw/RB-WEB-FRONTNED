import Link from "next/link";
import { ui } from "@/app/ui";
import { listJudgments } from "@/lib/api";

function IconSearch() {
  return (
    <svg
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <circle cx="11" cy="11" r="8" />
      <path d="m21 21-4.3-4.3" />
    </svg>
  );
}

function IconPlus() {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.5"
      strokeLinecap="round"
    >
      <path d="M12 5v14M5 12h14" />
    </svg>
  );
}

function IconDoc() {
  return (
    <svg
      width="48"
      height="48"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="text-slate-300"
    >
      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
      <polyline points="14,2 14,8 20,8" />
      <line x1="16" y1="13" x2="8" y2="13" />
      <line x1="16" y1="17" x2="8" y2="17" />
      <line x1="10" y1="9" x2="8" y2="9" />
    </svg>
  );
}

function IconChevronLeft() {
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
      <path d="m15 18-6-6 6-6" />
    </svg>
  );
}

function IconChevronRight() {
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
      <path d="m9 18 6-6-6-6" />
    </svg>
  );
}

// Pagination Component
function Pagination({
  currentPage,
  totalPages,
  search,
}: {
  currentPage: number;
  totalPages: number;
  search: string;
}) {
  const buildHref = (page: number) => {
    const params = new URLSearchParams();
    if (search) params.set("search", search);
    params.set("page", String(page));
    return `/judgments?${params.toString()}`;
  };

  // สร้าง array ของเลขหน้าที่จะแสดง
  const getPageNumbers = () => {
    const pages: (number | string)[] = [];
    const showPages = 5; // จำนวนหน้าที่แสดง

    if (totalPages <= showPages + 2) {
      // แสดงทุกหน้า
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      // แสดงบางหน้า + ...
      if (currentPage <= 3) {
        for (let i = 1; i <= 4; i++) pages.push(i);
        pages.push("...");
        pages.push(totalPages);
      } else if (currentPage >= totalPages - 2) {
        pages.push(1);
        pages.push("...");
        for (let i = totalPages - 3; i <= totalPages; i++) pages.push(i);
      } else {
        pages.push(1);
        pages.push("...");
        for (let i = currentPage - 1; i <= currentPage + 1; i++) pages.push(i);
        pages.push("...");
        pages.push(totalPages);
      }
    }

    return pages;
  };

  return (
    <div className="flex items-center justify-center gap-1">
      {/* Previous */}
      {currentPage > 1 ? (
        <Link
          href={buildHref(currentPage - 1)}
          className="grid h-9 w-9 place-items-center rounded-lg border bg-white text-slate-600 transition hover:bg-slate-50"
          style={{ borderColor: "var(--border)" }}
        >
          <IconChevronLeft />
        </Link>
      ) : (
        <span
          className="grid h-9 w-9 place-items-center rounded-lg border bg-slate-50 text-slate-300 cursor-not-allowed"
          style={{ borderColor: "var(--border)" }}
        >
          <IconChevronLeft />
        </span>
      )}

      {/* Page Numbers */}
      {getPageNumbers().map((page, idx) =>
        page === "..." ? (
          <span key={`dots-${idx}`} className="px-2 text-slate-400">
            ...
          </span>
        ) : (
          <Link
            key={page}
            href={buildHref(page as number)}
            className={[
              "grid h-9 min-w-[36px] place-items-center rounded-lg border px-2 text-sm font-medium transition",
              currentPage === page
                ? "border-slate-900 bg-slate-900 text-white"
                : "border-slate-200 bg-white text-slate-600 hover:bg-slate-50",
            ].join(" ")}
          >
            {page}
          </Link>
        )
      )}

      {/* Next */}
      {currentPage < totalPages ? (
        <Link
          href={buildHref(currentPage + 1)}
          className="grid h-9 w-9 place-items-center rounded-lg border bg-white text-slate-600 transition hover:bg-slate-50"
          style={{ borderColor: "var(--border)" }}
        >
          <IconChevronRight />
        </Link>
      ) : (
        <span
          className="grid h-9 w-9 place-items-center rounded-lg border bg-slate-50 text-slate-300 cursor-not-allowed"
          style={{ borderColor: "var(--border)" }}
        >
          <IconChevronRight />
        </span>
      )}
    </div>
  );
}

export default async function Page({
  searchParams,
}: {
  searchParams: Promise<{ search?: string; page?: string }>;
}) {
  const sp = await searchParams;
  const search = sp.search || "";
  const page = Math.max(1, parseInt(sp.page || "1", 10));
  const limit = 10;

  const data = await listJudgments(search, page, limit);
  const items = data?.items || [];
  const total = data?.total || 0;
  const totalPages = data?.totalPages || 1;

  return (
    <div className="space-y-6 stagger-children">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="text-3xl font-semibold tracking-tight text-slate-900">
            ทะเบียนคำพิพากษา
          </h1>
          <p className="mt-1 text-sm text-slate-500">
            ค้นหา ดูรายละเอียด และจัดเก็บข้อมูลคำพิพากษาอย่างเป็นระบบ
          </p>
        </div>

        <Link
          href="/judgments/new"
          className={`${ui.btn} ${ui.btnAccent} shadow-lg shadow-blue-900/20`}
        >
          <IconPlus />
          เพิ่มบันทึกใหม่
        </Link>
      </div>

      {/* Search & Stats */}
      <div className={`${ui.card} overflow-hidden`}>
        <div className="p-5">
          <form className="flex flex-col gap-3 sm:flex-row">
            <div className="relative flex-1">
              <div className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">
                <IconSearch />
              </div>
              <input
                name="search"
                defaultValue={search}
                placeholder="ค้นหา: เลขเอกสาร / ชื่อเรื่อง / เลขคดี / ศาล / หมายเหตุ..."
                className={`${ui.input} pl-12`}
              />
            </div>
            <button className={`${ui.btn} ${ui.btnGhost} min-w-[100px]`}>
              ค้นหา
            </button>
          </form>
        </div>

        <div
          className="flex items-center justify-between border-t bg-slate-50/50 px-5 py-3"
          style={{ borderColor: "var(--border)" }}
        >
          <div className="flex items-center gap-3 text-sm text-slate-500">
            <span className="h-2 w-2 rounded-full bg-emerald-500" />
            ทั้งหมด
            <span className="font-semibold text-slate-900">{total}</span>
            รายการ
            {totalPages > 1 && (
              <span className="text-slate-400">
                (หน้า {page} / {totalPages})
              </span>
            )}
          </div>
          {search && (
            <Link
              href="/judgments"
              className="text-sm font-medium text-blue-600 hover:text-blue-700 hover:underline"
            >
              ล้างการค้นหา
            </Link>
          )}
        </div>
      </div>

      {/* Table */}
      <div className={`${ui.cardElevated} overflow-hidden`}>
        <div className="overflow-x-auto">
          <table className="min-w-[900px] w-full text-sm">
            <thead>
              <tr
                className="border-b bg-slate-50/80"
                style={{ borderColor: "var(--border)" }}
              >
                <th className="px-5 py-4 text-left">
                  <span className={ui.tableHeader}>
                    ชื่อเรื่อง / รายละเอียด
                  </span>
                </th>
                <th className="px-5 py-4 text-left w-[150px]">
                  <span className={ui.tableHeader}>เลขที่เอกสาร</span>
                </th>
                <th className="px-5 py-4 text-left w-[180px]">
                  <span className={ui.tableHeader}>ศาล/หน่วยงาน</span>
                </th>
                <th className="px-5 py-4 text-left w-[140px]">
                  <span className={ui.tableHeader}>เลขคดี</span>
                </th>
                <th className="px-5 py-4 text-left w-[130px]">
                  <span className={ui.tableHeader}>วันที่</span>
                </th>
                <th className="px-5 py-4 w-[60px]"></th>
              </tr>
            </thead>

            <tbody
              className="divide-y"
              style={{ borderColor: "var(--border)" }}
            >
              {items.map((j) => (
                <tr
                  key={j.id}
                  className="group transition-colors duration-150 hover:bg-blue-50/50"
                >
                  <td className="px-5 py-4">
                    <Link
                      href={`/judgments/${j.id}`}
                      className="group/link block"
                    >
                      <div className="font-semibold text-slate-900 group-hover/link:text-blue-700 transition-colors">
                        {j.title}
                      </div>
                      <div className="mt-1 text-xs text-slate-500">
                        {j.case_no ?? "-"} • {j.court ?? "-"}
                      </div>

                      {j.tags?.length ? (
                        <div className="mt-2.5 flex flex-wrap gap-1.5">
                          {j.tags.slice(0, 4).map((t) => (
                            <span key={t} className={ui.badgeAccent}>
                              #{t}
                            </span>
                          ))}
                          {j.tags.length > 4 && (
                            <span className={ui.badge}>
                              +{j.tags.length - 4}
                            </span>
                          )}
                        </div>
                      ) : null}
                    </Link>
                  </td>

                  <td className="px-5 py-4">
                    <span
                      className={
                        j.doc_no ? " text-slate-700" : "text-slate-400"
                      }
                    >
                      {j.doc_no || "-"}
                    </span>
                  </td>

                  <td className="px-5 py-4 text-slate-600">
                    {j.court || <span className="text-slate-400">-</span>}
                  </td>

                  <td className="px-5 py-4">
                    <span
                      className={
                        j.case_no ? " text-slate-700" : "text-slate-400"
                      }
                    >
                      {j.case_no || "-"}
                    </span>
                  </td>

                  <td className="px-5 py-4 text-slate-600">
                    {j.judgment_date || (
                      <span className="text-slate-400 ">-</span>
                    )}
                  </td>

                  <td className="px-5 py-4">
                    <Link
                      href={`/judgments/${j.id}`}
                      className="grid h-8 w-8 place-items-center rounded-lg text-slate-400 transition-all duration-200 group-hover:bg-white group-hover:text-blue-600 group-hover:shadow-sm"
                    >
                      <IconChevronRight />
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {/* Empty state */}
          {!items.length && (
            <div className="px-5 py-16 text-center">
              <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-2xl bg-slate-100">
                <IconDoc />
              </div>
              <div className="mt-5 text-lg font-semibold text-slate-900">
                ยังไม่มีข้อมูล
              </div>
              <div className="mt-2 text-sm text-slate-500">
                {search
                  ? `ไม่พบผลลัพธ์สำหรับ "${search}"`
                  : "กด เพิ่มบันทึกใหม่ เพื่อสร้างรายการแรก"}
              </div>
              <div className="mt-6 flex items-center justify-center gap-3">
                {search && (
                  <Link
                    href="/judgments"
                    className={`${ui.btn} ${ui.btnGhost}`}
                  >
                    ล้างการค้นหา
                  </Link>
                )}
                <Link
                  href="/judgments/new"
                  className={`${ui.btn} ${ui.btnAccent}`}
                >
                  <IconPlus />
                  เพิ่มบันทึกใหม่
                </Link>
              </div>
            </div>
          )}
        </div>

        {/* Pagination */}
        {total > 0 && (
          <div
            className="border-t bg-slate-50/50 px-5 py-4"
            style={{ borderColor: "var(--border)" }}
          >
            <Pagination
              currentPage={page}
              totalPages={totalPages}
              search={search}
            />
          </div>
        )}
      </div>
    </div>
  );
}
