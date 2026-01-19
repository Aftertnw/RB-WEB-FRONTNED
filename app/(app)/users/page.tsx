'use client';

import { useAuth } from '@/lib/auth';
import { useRouter, useSearchParams } from 'next/navigation';
import { useEffect, useState, useCallback, useMemo, useTransition } from 'react';
import { listUsers, updateUser, deleteUser, createUser, type User } from '@/lib/api';
import { ui } from '@/app/ui';
import LoadingOverlay from '@/components/ui/LoadingOverlay';
import { ConfirmModal } from '@/components/modal/ConfirmModal';
import { useTranslation } from 'react-i18next';

function IconTrash() {
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
      <path d="M3 6h18m-2 0v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6m3 0V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2" />
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

function IconShield() {
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
      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
    </svg>
  );
}

function IconEdit() {
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
      <path d="M17 3a2.828 2.828 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5L17 3z" />
    </svg>
  );
}

function IconClose() {
  return (
    <svg
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M18 6L6 18M6 6l12 12" />
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
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M12 5v14M5 12h14" />
    </svg>
  );
}

function IconCheck() {
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
      <path d="M20 6 9 17l-5-5" />
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

// Pagination (เหมือน judgments)
function Pagination({
  currentPage,
  totalPages,
  onNavigate,
  isPending,
}: {
  currentPage: number;
  totalPages: number;
  onNavigate: (page: number) => void;
  isPending: boolean;
}) {
  const getPageNumbers = () => {
    const pages: (number | string)[] = [];
    const showPages = 5;

    if (totalPages <= showPages + 2) {
      for (let i = 1; i <= totalPages; i++) pages.push(i);
    } else {
      if (currentPage <= 3) {
        for (let i = 1; i <= 4; i++) pages.push(i);
        pages.push('...');
        pages.push(totalPages);
      } else if (currentPage >= totalPages - 2) {
        pages.push(1);
        pages.push('...');
        for (let i = totalPages - 3; i <= totalPages; i++) pages.push(i);
      } else {
        pages.push(1);
        pages.push('...');
        for (let i = currentPage - 1; i <= currentPage + 1; i++) pages.push(i);
        pages.push('...');
        pages.push(totalPages);
      }
    }
    return pages;
  };

  return (
    <div className="flex items-center justify-center gap-1">
      <button
        type="button"
        disabled={currentPage <= 1 || isPending}
        onClick={() => onNavigate(currentPage - 1)}
        className={[
          'grid h-9 w-9 place-items-center rounded-lg border transition',
          currentPage > 1
            ? 'bg-white text-slate-600 hover:bg-slate-50'
            : 'bg-slate-50 text-slate-300 cursor-not-allowed',
        ].join(' ')}
        style={{ borderColor: 'var(--border)' }}
      >
        <IconChevronLeft />
      </button>

      {getPageNumbers().map((p, idx) =>
        p === '...' ? (
          <span key={`dots-${idx}`} className="px-2 text-slate-400">
            ...
          </span>
        ) : (
          <button
            key={p}
            type="button"
            disabled={isPending}
            onClick={() => onNavigate(p as number)}
            className={[
              'grid h-9 min-w-[36px] place-items-center rounded-lg border px-2 text-sm font-medium transition',
              currentPage === p
                ? 'border-slate-900 bg-slate-900 text-white'
                : 'border-slate-200 bg-white text-slate-600 hover:bg-slate-50',
            ].join(' ')}
          >
            {p}
          </button>
        ),
      )}

      <button
        type="button"
        disabled={currentPage >= totalPages || isPending}
        onClick={() => onNavigate(currentPage + 1)}
        className={[
          'grid h-9 w-9 place-items-center rounded-lg border transition',
          currentPage < totalPages
            ? 'bg-white text-slate-600 hover:bg-slate-50'
            : 'bg-slate-50 text-slate-300 cursor-not-allowed',
        ].join(' ')}
        style={{ borderColor: 'var(--border)' }}
      >
        <IconChevronRight />
      </button>
    </div>
  );
}

export default function UsersPage() {
  const { t, i18n } = useTranslation();
  const { user: currentUser, loading } = useAuth();
  const router = useRouter();
  const sp = useSearchParams();

  const urlSearch = sp.get('search') || '';
  const urlPage = Math.max(1, parseInt(sp.get('page') || '1', 10));

  // ✅ ให้เหมือน judgments (ใช้ transition คุม overlay ตอนกดค้นหา/เปลี่ยนหน้า)
  const [isPending, startTransition] = useTransition();
  const showOverlay = isPending;

  const [users, setUsers] = useState<User[]>([]);
  const [fetching, setFetching] = useState(true);
  const [updatingId, setUpdatingId] = useState<string | null>(null);

  // input ในช่องค้นหา (sync กับ URL) เหมือน judgments
  const [q, setQ] = useState(urlSearch);
  useEffect(() => {
    setQ(urlSearch);
  }, [urlSearch]);

  const urlTab = sp.get('tab');
  const [tab, setTab] = useState<'active' | 'pending'>(
    (urlTab as 'active' | 'pending') || 'active',
  );

  useEffect(() => {
    if (urlTab === 'active' || urlTab === 'pending') {
      setTab(urlTab);
    }
  }, [urlTab]);

  // Edit Modal State
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [editForm, setEditForm] = useState({
    name: '',
    email: '',
    role: 'user' as 'admin' | 'user' | 'owner',
    password: '',
  });

  // Create Modal State
  const [creating, setCreating] = useState(false);
  const [createForm, setCreateForm] = useState({
    name: '',
    email: '',
    password: '',
    role: 'user' as 'admin' | 'user' | 'owner',
  });

  // Confirm Modal State
  const [confirmModal, setConfirmModal] = useState<{
    open: boolean;
    type: 'create' | 'update' | 'delete' | null;
    title: string;
    message: string;
    danger?: boolean;
    data?: any;
  }>({
    open: false,
    type: null,
    title: '',
    message: '',
    danger: false,
    data: null,
  });

  const closeConfirmModal = () => {
    setConfirmModal((prev) => ({ ...prev, open: false }));
  };

  const fetchUsers = useCallback(async () => {
    try {
      setFetching(true);
      const data = await listUsers();
      setUsers(data || []);
    } catch (error) {
      console.error('Failed to fetch users:', error);
      alert('ไม่สามารถดึงข้อมูลผู้ใช้งานได้');
    } finally {
      setFetching(false);
    }
  }, []);

  useEffect(() => {
    if (!loading && currentUser?.role !== 'admin' && currentUser?.role !== 'owner') {
      router.replace('/judgments');
      return;
    }
    if (!loading && (currentUser?.role === 'admin' || currentUser?.role === 'owner')) {
      fetchUsers();
    }
  }, [currentUser, loading, router, fetchUsers]);

  // ✅ filter ตาม urlSearch (เหมือน judgments ที่ใช้ urlSearch เป็นตัวจริง) AND tab
  const filteredUsers = useMemo(() => {
    let res = users;

    // Filter by tab
    if (tab === 'active') {
      res = res.filter((u) => u.is_approved !== false);
    } else {
      res = res.filter((u) => u.is_approved === false);
    }

    const text = urlSearch.trim().toLowerCase();
    if (!text) return res;

    return res.filter((u) => {
      const name = (u.name || '').toLowerCase();
      const email = (u.email || '').toLowerCase();
      const role = (u.role || '').toLowerCase();
      return name.includes(text) || email.includes(text) || role.includes(text);
    });
  }, [users, urlSearch, tab]);

  // ✅ client pagination (ให้ UX เหมือน judgments)
  const limit = 10;
  const total = filteredUsers.length;
  const totalPages = Math.max(1, Math.ceil(total / limit));
  const currentPage = Math.min(urlPage, totalPages);

  const pageItems = useMemo(() => {
    const start = (currentPage - 1) * limit;
    return filteredUsers.slice(start, start + limit);
  }, [filteredUsers, currentPage]);

  // ✅ กัน URL page เกินจริง (เช่น ลบจนหน้าหาย) แล้วให้กลับไปหน้าสุดท้าย
  useEffect(() => {
    if (fetching) return;
    if (urlPage !== currentPage) {
      startTransition(() => {
        router.replace(buildUrl(urlSearch, currentPage));
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [fetching, urlPage, currentPage, urlSearch]);

  function buildUrl(nextSearch: string, nextPage: number, nextTab?: string) {
    const params = new URLSearchParams();
    if (nextSearch.trim()) params.set('search', nextSearch.trim());
    params.set('page', String(nextPage));
    if (nextTab) {
      params.set('tab', nextTab);
    } else if (tab) {
      // preserve current tab if not specified
      params.set('tab', tab);
    }
    return `/users?${params.toString()}`;
  }

  function onSubmitSearch(e: React.FormEvent) {
    e.preventDefault();
    startTransition(() => {
      router.push(buildUrl(q, 1));
    });
  }

  function onClearSearch() {
    startTransition(() => {
      router.push('/users?page=1');
    });
  }

  function onNavigate(page: number) {
    startTransition(() => {
      router.push(buildUrl(urlSearch, page));
    });
  }

  const handleOpenEdit = (user: User) => {
    setEditingUser(user);
    setEditForm({
      name: user.name,
      email: user.email,
      role: user.role,
      password: '',
    });
  };

  const handleOpenCreate = () => {
    setCreateForm({ name: '', email: '', password: '', role: 'user' });
    setCreating(true);
  };

  const handleCreateClick = async (e: React.FormEvent) => {
    e.preventDefault();

    if (createForm.password.trim().length < 6) {
      alert('รหัสผ่านต้องมีอย่างน้อย 6 ตัวอักษร');
      return;
    }

    try {
      setUpdatingId('creating');
      await createUser(createForm);
      await fetchUsers();
      setCreating(false);
    } catch (err: any) {
      console.error('Failed to create user:', err);
      alert(err?.message || 'ไม่สามารถสร้างผู้ใช้งานได้');
    } finally {
      setUpdatingId(null);
    }
  };

  const handleUpdateClick = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingUser) return;

    const payload: any = {
      name: editForm.name,
      email: editForm.email,
      role: editForm.role,
    };

    const pw = (editForm.password || '').trim();
    if (pw) {
      if (pw.length < 6) {
        alert('รหัสผ่านต้องมีอย่างน้อย 6 ตัวอักษร');
        return;
      }
      payload.password = pw;
    }

    try {
      setUpdatingId(editingUser.id);
      await updateUser(editingUser.id, payload);

      setUsers(users.map((u) => (u.id === editingUser.id ? { ...u, ...payload } : u)));
      setEditingUser(null);
    } catch (err: any) {
      console.error('Failed to update user:', err);
      alert(err?.message || 'ไม่สามารถอัปเดตข้อมูลผู้ใช้งานได้');
    } finally {
      setUpdatingId(null);
    }
  };

  const handleDeleteClick = (user: User) => {
    if (user.id === currentUser?.id) {
      alert('You cannot delete yourself');
      return;
    }

    setConfirmModal({
      open: true,
      type: 'delete',
      title: t('dialog.delete_user.title'),
      message: t('dialog.delete_user.message', { name: user.email }),
      danger: true,
      data: user,
    });
  };

  const handleApprove = (user: User) => {
    setConfirmModal({
      open: true,
      type: 'update',
      title: t('dialog.approve_user.title'),
      message: t('dialog.approve_user.message', { name: user.name }),
      danger: false,
      data: { ...user, action: 'approve' },
    });
  };

  const performAction = async () => {
    const { type, data } = confirmModal;
    if (!type) return;

    try {
      if (type === 'delete') {
        const userId = data.id;
        setUpdatingId(userId);
        await deleteUser(userId);
        setUsers(users.filter((u) => u.id !== userId));
      } else if (type === 'update' && data.action === 'approve') {
        const userId = data.id;
        setUpdatingId(userId);
        await updateUser(userId, { is_approved: true });
        setUsers(users.map((u) => (u.id === userId ? { ...u, is_approved: true } : u)));
      }
      closeConfirmModal();
    } catch (err: any) {
      console.error(`Failed to ${type} user:`, err);
      alert(err?.message || `ไม่สามารถดำเนินการ ${type} ได้`);
    } finally {
      setUpdatingId(null);
    }
  };

  if (loading || (currentUser?.role !== 'admin' && currentUser?.role !== 'owner')) {
    return (
      <div className="flex h-[50vh] items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-slate-200 border-t-slate-800" />
      </div>
    );
  }

  return (
    <div className="space-y-6 stagger-children">
      <header className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="text-3xl font-semibold tracking-tight text-slate-900">
            {t('users.title')}
          </h1>
          <p className="mt-1 text-sm text-slate-500">{t('users.subtitle')}</p>
        </div>

        <button
          onClick={handleOpenCreate}
          className={`${ui.btn} ${ui.btnAccent} inline-flex items-center gap-2`}
        >
          <IconPlus />
          {t('users.add_button')}
        </button>
      </header>

      {/* ✅ Search & Stats (เหมือน judgments 100%) */}
      <div className={`${ui.card} overflow-hidden`}>
        <div className="p-5">
          <form onSubmit={onSubmitSearch} className="flex flex-col gap-3 sm:flex-row">
            <div className="relative flex-1">
              <div className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">
                <IconSearch />
              </div>
              <input
                name="search"
                value={q}
                onChange={(e) => setQ(e.target.value)}
                placeholder={t('users.search_placeholder')}
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

        {/* Tabs */}
        <div
          className="flex border-b pl-5 overflow-x-auto"
          style={{ borderColor: 'var(--border)' }}
        >
          <button
            onClick={() => {
              setTab('active');
              router.replace(buildUrl(urlSearch, 1, 'active'));
            }}
            className={`mr-6 border-b-2 py-3 text-sm font-medium transition-colors ${
              tab === 'active'
                ? 'border-blue-600 text-blue-600'
                : 'border-transparent text-slate-500 hover:text-slate-700'
            }`}
          >
            {t('users.tabs.active')}
          </button>
          <button
            onClick={() => {
              setTab('pending');
              router.replace(buildUrl(urlSearch, 1, 'pending'));
            }}
            className={`mr-6 border-b-2 py-3 text-sm font-medium transition-colors ${
              tab === 'pending'
                ? 'border-amber-500 text-amber-600'
                : 'border-transparent text-slate-500 hover:text-slate-700'
            }`}
          >
            {t('users.tabs.pending')}
            {users.filter((u) => u.is_approved === false).length > 0 && (
              <span className="ml-2 inline-flex items-center justify-center rounded-full bg-amber-100 px-2 py-0.5 text-xs text-amber-700">
                {users.filter((u) => u.is_approved === false).length}
              </span>
            )}
          </button>
        </div>

        <div
          className="flex items-center justify-between border-t bg-slate-50/50 px-5 py-3"
          style={{ borderColor: 'var(--border)' }}
        >
          <div className="flex items-center gap-3 text-sm text-slate-500">
            <span className="h-2 w-2 rounded-full bg-emerald-500" />
            {t('judgments.total_items', { count: total })}
            {totalPages > 1 && (
              <span className="text-slate-400">
                {t('common.page_info', {
                  current: currentPage,
                  total: totalPages,
                })}
              </span>
            )}
            {!!urlSearch.trim() && (
              <span className="text-slate-400">
                {t('common.from_total', { count: users.length })}
              </span>
            )}
          </div>

          {!!urlSearch.trim() && (
            <button
              type="button"
              onClick={onClearSearch}
              className="text-sm font-medium text-blue-600 hover:text-blue-700 hover:underline"
              disabled={isPending}
            >
              {t('common.clear_search')}
            </button>
          )}
        </div>
      </div>

      <div className={`${ui.cardElevated} overflow-hidden`}>
        <div className="overflow-x-auto">
          <table className="min-w-[800px] w-full text-sm">
            <thead>
              <tr className="border-b bg-slate-50/80" style={{ borderColor: 'var(--border)' }}>
                <th className="px-5 py-4 text-left">
                  <span className={ui.tableHeader}>{t('users.table.user')}</span>
                </th>
                <th className="px-5 py-4 text-left w-[250px]">
                  <span className={ui.tableHeader}>{t('users.table.role')}</span>
                </th>
                <th className="px-5 py-4 text-left w-[200px]">
                  <span className={ui.tableHeader}>{t('users.table.joined_date')}</span>
                </th>
                <th className="px-5 py-4 text-center w-[200px]">
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
              ) : pageItems.length === 0 ? (
                <tr>
                  <td colSpan={4} className="px-5 py-12 text-center text-slate-400">
                    {urlSearch.trim()
                      ? t('common.no_results', { query: urlSearch })
                      : t('common.no_data')}
                  </td>
                </tr>
              ) : (
                pageItems.map((u) => (
                  <tr
                    key={u.id}
                    className="group transition-colors duration-150 hover:bg-slate-50/50"
                  >
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-3">
                        <div className="h-10 w-10 overflow-hidden rounded-full bg-slate-100 ring-2 ring-white">
                          {u.avatar_url ? (
                            <img
                              src={u.avatar_url}
                              alt={u.name}
                              className="h-full w-full object-cover"
                            />
                          ) : (
                            <div className="flex h-full w-full items-center justify-center bg-blue-100 text-blue-700 font-bold uppercase">
                              {u.name?.charAt(0) || 'U'}
                            </div>
                          )}
                        </div>
                        <div>
                          <div className="font-semibold text-slate-900">{u.name}</div>
                          <div className="text-xs text-slate-500">{u.email}</div>
                        </div>
                      </div>
                    </td>

                    <td className="px-5 py-4">
                      <span
                        className={[
                          'inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-semibold whitespace-nowrap',
                          u.role === 'admin'
                            ? 'bg-amber-100 text-amber-700'
                            : u.role === 'owner'
                              ? 'bg-purple-100 text-purple-700'
                              : 'bg-blue-100 text-blue-700',
                        ].join(' ')}
                      >
                        {u.role === 'admin' && <IconShield />}
                        {u.role === 'owner' && <IconShield />}
                        {u.role === 'admin'
                          ? t('users.roles.admin')
                          : u.role === 'owner'
                            ? 'Owner'
                            : t('users.roles.user')}
                      </span>
                    </td>

                    <td className="px-5 py-4 text-slate-500">
                      {u.created_at
                        ? new Date(u.created_at).toLocaleDateString(
                            i18n.language === 'th' ? 'th-TH' : 'en-US',
                            {
                              year: 'numeric',
                              month: 'long',
                              day: 'numeric',
                            },
                          )
                        : '-'}
                    </td>

                    <td className="px-5 py-4 text-center">
                      <div className="flex items-center justify-center gap-2">
                        {tab === 'pending' && (
                          <>
                            <button
                              disabled={updatingId === u.id}
                              onClick={() => handleApprove(u)}
                              className={`${ui.btn} bg-emerald-50 text-emerald-600 hover:bg-emerald-100 hover:shadow-md transition-all px-3 py-1.5 gap-1.5`}
                            >
                              <IconCheck />
                              <span className="text-xs">{t('users.actions.approve')}</span>
                            </button>
                            <button
                              disabled={updatingId === u.id}
                              onClick={() => handleDeleteClick(u)}
                              className={`${ui.btn} bg-red-50 text-red-600 hover:bg-red-100 hover:shadow-md transition-all px-3 py-1.5 gap-1.5 whitespace-nowrap`}
                            >
                              <IconClose />
                              <span className="text-xs">{t('users.actions.reject')}</span>
                            </button>
                          </>
                        )}

                        {tab !== 'pending' && (
                          <>
                            {/* Check: Target Owner/Admin vs Current Role */}
                            {!(
                              (u.role === 'owner' && currentUser?.role !== 'owner') ||
                              (currentUser?.role === 'admin' &&
                                u.role === 'admin' &&
                                u.id !== currentUser?.id) ||
                              (u.email === 'thanawuth.rod@gmail.com' && u.id !== currentUser?.id)
                            ) && (
                              <button
                                disabled={updatingId === u.id}
                                onClick={() => handleOpenEdit(u)}
                                className={`${ui.btn} ${ui.btnGhost} px-2 py-1.5`}
                                data-tooltip="แก้ไขรายละเอียด"
                              >
                                <IconEdit />
                              </button>
                            )}

                            {!(
                              (u.role === 'owner' && currentUser?.role !== 'owner') ||
                              (currentUser?.role === 'admin' &&
                                u.role === 'admin' &&
                                u.id !== currentUser?.id) ||
                              (u.email === 'thanawuth.rod@gmail.com' && u.id !== currentUser?.id)
                            ) && (
                              <button
                                disabled={updatingId === u.id || u.id === currentUser?.id}
                                onClick={() => handleDeleteClick(u)}
                                className={`${ui.btn} ${ui.btnGhost} text-red-500 hover:bg-red-50 hover:text-red-600 px-2 py-1.5`}
                                data-tooltip="ลบผู้ใช้งาน"
                              >
                                <IconTrash />
                              </button>
                            )}
                          </>
                        )}
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* ✅ Pagination (เหมือน judgments) */}
        {total > 0 && totalPages > 1 && (
          <div
            className="border-t bg-slate-50/50 px-5 py-4"
            style={{ borderColor: 'var(--border)' }}
          >
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              onNavigate={onNavigate}
              isPending={isPending}
            />
          </div>
        )}
      </div>

      {/* Edit Modal */}
      {editingUser && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
          <div
            className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm"
            onClick={() => setEditingUser(null)}
          />
          <div className="relative w-full max-w-md animate-in fade-in zoom-in duration-200">
            <div className={`${ui.cardElevated} bg-white shadow-2xl overflow-hidden`}>
              <div
                className="flex items-center justify-between border-b p-5"
                style={{ borderColor: 'var(--border)' }}
              >
                <h3 className="text-lg font-semibold text-slate-900">
                  {t('users.form.edit_title')}
                </h3>
                <button
                  onClick={() => setEditingUser(null)}
                  className="text-slate-400 hover:text-slate-600"
                >
                  <IconClose />
                </button>
              </div>

              <form onSubmit={handleUpdateClick} className="p-6 space-y-4">
                <div className="space-y-1.5">
                  <label className={ui.label}>{t('users.form.name')}</label>
                  <input
                    required
                    type="text"
                    value={editForm.name}
                    onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
                    className={ui.input}
                    placeholder={t('users.form.name')}
                  />
                </div>

                <div className="space-y-1.5">
                  <label className={ui.label}>{t('users.form.email')}</label>
                  <input
                    required
                    type="email"
                    value={editForm.email}
                    onChange={(e) => setEditForm({ ...editForm, email: e.target.value })}
                    className={ui.input}
                    placeholder="example@gmail.com"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className={ui.label}>{t('users.form.role')}</label>
                  <select
                    value={editForm.role}
                    onChange={(e) =>
                      setEditForm({
                        ...editForm,
                        role: e.target.value as 'admin' | 'user' | 'owner',
                      })
                    }
                    className={ui.input}
                    disabled={editingUser.id === currentUser?.id}
                  >
                    <option value="user">{t('users.form.role_user')}</option>
                    <option value="admin">{t('users.form.role_admin')}</option>
                    {currentUser?.role === 'owner' && (
                      <option value="owner">Owner (เจ้าของระบบ)</option>
                    )}
                  </select>
                  {editingUser.id === currentUser?.id && (
                    <p className="mt-1 text-[10px] text-amber-600">
                      {t('users.form.self_role_warning')}
                    </p>
                  )}
                </div>

                <div className="space-y-1.5">
                  <label className={ui.label}>{t('users.form.password')}</label>
                  <input
                    type="password"
                    value={editForm.password}
                    onChange={(e) => setEditForm({ ...editForm, password: e.target.value })}
                    className={ui.input}
                    placeholder={t('users.form.password_placeholder')}
                  />
                  <p className="mt-1 text-[10px] text-slate-500">{t('users.form.password_hint')}</p>
                </div>

                <div
                  className="flex items-center justify-end gap-3 border-t bg-slate-50 px-6 py-4"
                  style={{ borderColor: 'var(--border)' }}
                >
                  <button
                    type="button"
                    onClick={() => setEditingUser(null)}
                    className={`${ui.btn} ${ui.btnGhost}`}
                  >
                    {t('common.cancel')}
                  </button>
                  <button
                    type="submit"
                    disabled={updatingId === editingUser.id}
                    className={`${ui.btn} ${ui.btnPrimary}`}
                  >
                    {updatingId === editingUser.id ? t('users.form.saving') : t('common.save')}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Create Modal */}
      {creating && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
          <div
            className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm"
            onClick={() => setCreating(false)}
          />
          <div className="relative w-full max-w-md animate-in fade-in zoom-in duration-200">
            <div className={`${ui.cardElevated} bg-white shadow-2xl overflow-hidden`}>
              <div
                className="flex items-center justify-between border-b p-5"
                style={{ borderColor: 'var(--border)' }}
              >
                <h3 className="text-lg font-semibold text-slate-900">
                  {t('users.form.create_title')}
                </h3>
                <button
                  onClick={() => setCreating(false)}
                  className="text-slate-400 hover:text-slate-600"
                >
                  <IconClose />
                </button>
              </div>

              <form onSubmit={handleCreateClick} className="p-6 space-y-4">
                <div className="space-y-1.5">
                  <label className={ui.label}>{t('users.form.name')}</label>
                  <input
                    required
                    type="text"
                    value={createForm.name}
                    onChange={(e) => setCreateForm({ ...createForm, name: e.target.value })}
                    className={ui.input}
                    placeholder={t('users.form.name')}
                  />
                </div>

                <div className="space-y-1.5">
                  <label className={ui.label}>{t('users.form.email')}</label>
                  <input
                    required
                    type="email"
                    value={createForm.email}
                    onChange={(e) => setCreateForm({ ...createForm, email: e.target.value })}
                    className={ui.input}
                    placeholder="example@gmail.com"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className={ui.label}>{t('users.form.password')}</label>
                  <input
                    required
                    type="password"
                    value={createForm.password}
                    onChange={(e) =>
                      setCreateForm({
                        ...createForm,
                        password: e.target.value,
                      })
                    }
                    className={ui.input}
                    placeholder={t('users.form.password_placeholder')}
                  />
                </div>

                <div className="space-y-1.5">
                  <label className={ui.label}>{t('users.form.role')}</label>
                  <select
                    value={createForm.role}
                    onChange={(e) =>
                      setCreateForm({
                        ...createForm,
                        role: e.target.value as 'admin' | 'user' | 'owner',
                      })
                    }
                    className={ui.input}
                  >
                    <option value="user">{t('users.form.role_user')}</option>
                    <option value="admin">{t('users.form.role_admin')}</option>
                    {currentUser?.role === 'owner' && (
                      <option value="owner">Owner (เจ้าของระบบ)</option>
                    )}
                  </select>
                </div>

                <div
                  className="mt-6 flex items-center justify-end gap-3 border-t bg-slate-50 -mx-6 -mb-6 px-6 py-4"
                  style={{ borderColor: 'var(--border)' }}
                >
                  <button
                    type="button"
                    onClick={() => setCreating(false)}
                    className={`${ui.btn} ${ui.btnGhost}`}
                    disabled={updatingId === 'creating'}
                  >
                    {t('common.cancel')}
                  </button>
                  <button
                    type="submit"
                    className={`${ui.btn} ${ui.btnPrimary}`}
                    disabled={updatingId === 'creating'}
                  >
                    {updatingId === 'creating' ? t('users.form.creating') : t('users.add_button')}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Confirm Modal */}
      <ConfirmModal
        open={confirmModal.open}
        title={confirmModal.title}
        message={confirmModal.message}
        onConfirm={performAction}
        onClose={closeConfirmModal}
        danger={confirmModal.danger}
        loading={!!updatingId}
      />
      {/* ✅ Fullscreen Loading (เหมือน judgments) */}
      <LoadingOverlay isLoading={showOverlay} message={t('common.processing')} />
    </div>
  );
}
