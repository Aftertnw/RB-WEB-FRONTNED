'use client';

import { useEffect, useState, useTransition } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { ui } from '@/app/ui';
import { listJudgments, approveJudgment, rejectJudgment, Judgment } from '@/lib/api';
import LoadingOverlay from '@/components/ui/LoadingOverlay';
import { ConfirmModal } from '@/components/modal/ConfirmModal';
import { useTranslation } from 'react-i18next';

function IconCheck() {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <polyline points="20 6 9 17 4 12" />
    </svg>
  );
}

function IconX() {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <line x1="18" y1="6" x2="6" y2="18" />
      <line x1="6" y1="6" x2="18" y2="18" />
    </svg>
  );
}

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

export default function ApprovePage() {
  const { t, i18n } = useTranslation();
  const router = useRouter();
  const sp = useSearchParams();

  const urlSearch = sp.get('search') || '';
  const [q, setQ] = useState(urlSearch);

  useEffect(() => {
    setQ(urlSearch);
  }, [urlSearch]);

  const [items, setItems] = useState<Judgment[]>([]);
  const [fetching, setFetching] = useState(true);
  const [isPending, startTransition] = useTransition();

  // Confirm Modal state
  const [confirmModal, setConfirmModal] = useState<{
    open: boolean;
    type: 'approve' | 'reject';
    id: string;
    title: string;
  }>({ open: false, type: 'approve', id: '', title: '' });
  const [actionLoading, setActionLoading] = useState(false);

  async function fetchData(search: string) {
    try {
      setFetching(true);
      // Fetch pending judgments AND delete requests
      const data = await listJudgments(search, 1, 100, 'pending_action');
      setItems(data?.items || []);
    } finally {
      setFetching(false);
    }
  }

  useEffect(() => {
    fetchData(urlSearch);
  }, [urlSearch]);

  function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    startTransition(() => {
      router.push(`/judgments/approve?search=${encodeURIComponent(q)}`);
    });
  }

  function openConfirm(type: 'approve' | 'reject', id: string, title: string) {
    setConfirmModal({ open: true, type, id, title });
  }

  async function handleConfirm() {
    setActionLoading(true);
    try {
      if (confirmModal.type === 'approve') {
        await approveJudgment(confirmModal.id);
      } else {
        await rejectJudgment(confirmModal.id);
      }
      setConfirmModal({ open: false, type: 'approve', id: '', title: '' });
      fetchData(urlSearch);
      // Notify AppShell to update stats immediately
      window.dispatchEvent(new Event('judgments:updated'));
    } catch (e) {
      alert('Error: ' + e);
    } finally {
      setActionLoading(false);
    }
  }

  const showOverlay = isPending;

  return (
    <div className="space-y-6 stagger-children">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-semibold tracking-tight text-slate-900">
          {t('sidebar.approve')}
        </h1>
      </div>

      {/* Search */}
      <div className={`${ui.card} overflow-hidden`}>
        <div className="p-5">
          <form onSubmit={onSubmit} className="flex flex-col gap-3 sm:flex-row">
            <div className="relative flex-1">
              <div className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">
                <IconSearch />
              </div>
              <input
                name="search"
                value={q}
                onChange={(e) => setQ(e.target.value)}
                placeholder={t('judgments.search_placeholder')}
                className={`${ui.input} pl-12`}
              />
            </div>

            <button
              type="submit"
              disabled={isPending}
              className={`${ui.btn} ${ui.btnGhost} min-w-[100px]`}
            >
              {t('judgments.search_button')}
            </button>
          </form>
        </div>
      </div>

      {/* Table */}
      <div className={`${ui.cardElevated} overflow-hidden`}>
        <div className="overflow-x-auto">
          <table className="min-w-[900px] w-full text-sm">
            <thead>
              <tr className="border-b bg-slate-50/80" style={{ borderColor: 'var(--border)' }}>
                <th className="px-5 py-4 text-left">
                  <span className={ui.tableHeader}>{t('judgments.table.subject')}</span>
                </th>
                <th className="px-5 py-4 text-left w-[150px]">
                  <span className={ui.tableHeader}>{t('judgments.table.doc_no')}</span>
                </th>
                <th className="px-5 py-4 text-left w-[130px]">
                  <span className={ui.tableHeader}>{t('judgments.table.date')}</span>
                </th>
                <th className="px-5 py-4 w-[200px] text-center">
                  <span className={ui.tableHeader}>{t('users.table.actions')}</span>
                </th>
              </tr>
            </thead>

            <tbody className="divide-y" style={{ borderColor: 'var(--border)' }}>
              {fetching ? (
                <tr>
                  <td colSpan={4} className="px-5 py-12 text-center text-slate-400">
                    {t('common.loading')}
                  </td>
                </tr>
              ) : (
                items.map((j) => (
                  <tr
                    key={j.id}
                    className="group transition-colors duration-150 hover:bg-blue-50/50"
                  >
                    <td className="px-5 py-4">
                      <a href={`/judgments/approve/${j.id}`} className="block group">
                        <div className="font-semibold text-slate-900 group-hover:text-amber-600 transition-colors">
                          {j.title}
                        </div>
                        <div className="mt-1 text-xs text-slate-500">
                          {j.case_no ?? '-'} • {j.court ?? '-'}
                        </div>
                        <div className="mt-1">
                          {j.status === 'request_delete' ? (
                            <span className="inline-flex items-center gap-1.5 rounded-full bg-rose-100 px-2.5 py-0.5 text-xs font-semibold text-rose-700">
                              <span className="h-1.5 w-1.5 rounded-full bg-rose-500" />
                              {t('judgments.status.request_delete')}
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1.5 rounded-full bg-amber-100 px-2.5 py-0.5 text-xs font-semibold text-amber-700">
                              <span className="h-1.5 w-1.5 rounded-full bg-amber-500" />
                              {t('judgments.status.pending')}
                            </span>
                          )}
                        </div>
                      </a>
                    </td>

                    <td className="px-5 py-4">
                      <span className={j.doc_no ? ' text-slate-700' : 'text-slate-400'}>
                        {j.doc_no || '-'}
                      </span>
                    </td>

                    <td className="px-5 py-4 text-slate-600">
                      {j.judgment_date ? (
                        new Date(j.judgment_date).toLocaleDateString(
                          i18n.language === 'th' ? 'th-TH' : 'en-US',
                          { year: 'numeric', month: 'short', day: 'numeric' },
                        )
                      ) : (
                        <span className="text-slate-400 ">-</span>
                      )}
                    </td>

                    <td className="px-5 py-4 text-center">
                      <div className="flex items-center justify-center gap-2">
                        <button
                          onClick={() => openConfirm('approve', j.id, j.title)}
                          className={`${ui.btn} bg-emerald-50 text-emerald-600 hover:bg-emerald-100 hover:shadow-md transition-all px-3 py-1.5 text-xs whitespace-nowrap`}
                        >
                          <IconCheck />
                          {j.status === 'request_delete'
                            ? t('common.delete')
                            : t('users.actions.approve')}
                        </button>
                        <button
                          onClick={() => openConfirm('reject', j.id, j.title)}
                          className={`${ui.btn} bg-red-50 text-red-600 hover:bg-red-100 hover:shadow-md transition-all px-3 py-1.5 text-xs whitespace-nowrap`}
                        >
                          <IconX />
                          {t('users.actions.reject')}
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>

          {!fetching && !items.length && (
            <div className="px-5 py-16 text-center">
              <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-2xl bg-slate-100">
                <IconDoc />
              </div>
              <div className="mt-5 text-lg font-semibold text-slate-900">{t('common.no_data')}</div>
            </div>
          )}
        </div>
      </div>

      <LoadingOverlay isLoading={showOverlay} message={t('common.processing')} />

      {/* Confirm Modal */}
      <ConfirmModal
        open={confirmModal.open}
        title={
          confirmModal.type === 'approve' ? t('users.actions.approve') : t('users.actions.reject')
        }
        message={
          confirmModal.type === 'approve'
            ? t('common.confirm_approve_message', { title: confirmModal.title })
            : t('common.confirm_reject_message', { title: confirmModal.title })
        }
        confirmText={
          confirmModal.type === 'approve' ? t('users.actions.approve') : t('users.actions.reject')
        }
        danger={confirmModal.type === 'reject'}
        onConfirm={handleConfirm}
        onClose={() => setConfirmModal({ open: false, type: 'approve', id: '', title: '' })}
        loading={actionLoading}
      />
    </div>
  );
}
