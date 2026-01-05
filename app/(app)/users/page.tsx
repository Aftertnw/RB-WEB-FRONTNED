'use client';

import { useAuth } from '@/lib/auth';
import { useRouter } from 'next/navigation';
import { useEffect, useState, useCallback } from 'react';
import { listUsers, updateUser, deleteUser, createUser, type User } from '@/lib/api';
import { ui } from '@/app/ui';

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

export default function UsersPage() {
  const { user: currentUser, loading } = useAuth();
  const router = useRouter();
  const [users, setUsers] = useState<User[]>([]);
  const [fetching, setFetching] = useState(true);
  const [updatingId, setUpdatingId] = useState<string | null>(null);

  // Edit Modal State
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [editForm, setEditForm] = useState({
    name: '',
    email: '',
    role: 'user' as 'admin' | 'user',
    password: '',
  });

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
    if (!loading && currentUser?.role !== 'admin') {
      router.replace('/judgments');
      return;
    }
    if (!loading && currentUser?.role === 'admin') {
      fetchUsers();
    }
  }, [currentUser, loading, router, fetchUsers]);

  const handleOpenEdit = (user: User) => {
    setEditingUser(user);
    setEditForm({ name: user.name, email: user.email, role: user.role, password: '' });
  };

  const handleOpenCreate = () => {
    setCreateForm({ name: '', email: '', password: '', role: 'user' });
    setCreating(true);
  };

  const handleCreate = async (e: React.FormEvent) => {
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

  // Create Modal State
  const [creating, setCreating] = useState(false);
  const [createForm, setCreateForm] = useState({
    name: '',
    email: '',
    password: '',
    role: 'user' as 'admin' | 'user',
  });

  const handleUpdate = async (e: React.FormEvent) => {
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
      payload.password = pw; // ✅ ส่งไป backend เฉพาะตอนกรอก
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

  const handleDelete = async (userId: string, email: string) => {
    if (userId === currentUser?.id) {
      alert('คุณไม่สามารถลบตัวเองได้');
      return;
    }

    if (!confirm(`ยืนยันการลบผู้ใช้งาน ${email}? การดำเนินการนี้ไม่สามารถย้อนกลับได้`)) return;

    try {
      setUpdatingId(userId);
      await deleteUser(userId);
      setUsers(users.filter((u) => u.id !== userId));
    } catch (err: any) {
      console.error('Failed to update user:', err);
      alert(err?.message || 'ไม่สามารถอัปเดตข้อมูลผู้ใช้งานได้');
    } finally {
      setUpdatingId(null);
    }
  };

  if (loading || currentUser?.role !== 'admin') {
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
          <h1 className="text-3xl font-semibold tracking-tight text-slate-900">จัดการผู้ใช้งาน</h1>
          <p className="mt-1 text-sm text-slate-500">
            จัดการสิทธิ์และข้อมูลผู้ใช้งานในระบบ (Admin Only)
          </p>
        </div>

        <button
          onClick={handleOpenCreate}
          className={`${ui.btn} ${ui.btnAccent} inline-flex items-center gap-2`}
        >
          <IconPlus />
          เพิ่มผู้ใช้งาน
        </button>
      </header>

      <div className={`${ui.cardElevated} overflow-hidden`}>
        <div className="overflow-x-auto">
          <table className="min-w-[800px] w-full text-sm">
            <thead>
              <tr className="border-b bg-slate-50/80" style={{ borderColor: 'var(--border)' }}>
                <th className="px-5 py-4 text-left">
                  <span className={ui.tableHeader}>ผู้ใช้งาน</span>
                </th>
                <th className="px-5 py-4 text-left w-[150px]">
                  <span className={ui.tableHeader}>สิทธิ์การใช้งาน</span>
                </th>
                <th className="px-5 py-4 text-left w-[200px]">
                  <span className={ui.tableHeader}>วันที่สมัคร</span>
                </th>
                <th className="px-5 py-4 text-right w-[200px]">
                  <span className={ui.tableHeader}>การดำเนินการ</span>
                </th>
              </tr>
            </thead>

            <tbody className="divide-y" style={{ borderColor: 'var(--border)' }}>
              {fetching ? (
                <tr>
                  <td colSpan={4} className="px-5 py-12 text-center text-slate-400">
                    กำลังโหลดข้อมูล...
                  </td>
                </tr>
              ) : users.length === 0 ? (
                <tr>
                  <td colSpan={4} className="px-5 py-12 text-center text-slate-400">
                    ไม่พบข้อมูลผู้ใช้งาน
                  </td>
                </tr>
              ) : (
                users.map((u) => (
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
                              {u.name.charAt(0)}
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
                          'inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-semibold',
                          u.role === 'admin'
                            ? 'bg-amber-100 text-amber-700'
                            : 'bg-blue-100 text-blue-700',
                        ].join(' ')}
                      >
                        {u.role === 'admin' && <IconShield />}
                        {u.role === 'admin' ? 'Admin' : 'User'}
                      </span>
                    </td>

                    <td className="px-5 py-4 text-slate-500">
                      {u.created_at
                        ? new Date(u.created_at).toLocaleDateString('th-TH', {
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric',
                          })
                        : '-'}
                    </td>

                    <td className="px-5 py-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          disabled={updatingId === u.id}
                          onClick={() => handleOpenEdit(u)}
                          className={`${ui.btn} ${ui.btnGhost} px-2 py-1.5`}
                          data-tooltip="แก้ไขรายละเอียด"
                        >
                          <IconEdit />
                        </button>

                        <button
                          disabled={updatingId === u.id || u.id === currentUser?.id}
                          onClick={() => handleDelete(u.id, u.email)}
                          className={`${ui.btn} ${ui.btnGhost} text-red-500 hover:bg-red-50 hover:text-red-600 px-2 py-1.5`}
                          data-tooltip="ลบผู้ใช้งาน"
                        >
                          <IconTrash />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Edit Modal */}
      {editingUser && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
          <div
            className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm"
            onClick={() => setEditingUser(null)}
          />
          <div className="relative w-full max-w-md animate-in fade-in zoom-in duration-200">
            <div className={`${ui.cardElevated} bg-white shadow-2xl`}>
              <div
                className="flex items-center justify-between border-b p-5"
                style={{ borderColor: 'var(--border)' }}
              >
                <h3 className="text-lg font-semibold text-slate-900">แก้ไขข้อมูลผู้ใช้งาน</h3>
                <button
                  onClick={() => setEditingUser(null)}
                  className="text-slate-400 hover:text-slate-600"
                >
                  <IconClose />
                </button>
              </div>

              <form onSubmit={handleUpdate} className="p-6 space-y-4">
                <div className="space-y-1.5">
                  <label className={ui.label}>ชื่อ-นามสกุล</label>
                  <input
                    required
                    type="text"
                    value={editForm.name}
                    onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
                    className={ui.input}
                    placeholder="ระบุชื่อพนักงาน"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className={ui.label}>อีเมล</label>
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
                  <label className={ui.label}>สิทธิ์การใช้งาน</label>
                  <select
                    value={editForm.role}
                    onChange={(e) =>
                      setEditForm({
                        ...editForm,
                        role: e.target.value as 'admin' | 'user',
                      })
                    }
                    className={ui.input}
                    disabled={editingUser.id === currentUser?.id}
                  >
                    <option value="user">User (ผู้ใช้งานทั่วไป)</option>
                    <option value="admin">Admin (ผู้ดูแลระบบ)</option>
                  </select>
                  {editingUser.id === currentUser?.id && (
                    <p className="mt-1 text-[10px] text-amber-600">
                      คุณไม่สามารถเปลี่ยนสิทธิ์ของตัวเองได้
                    </p>
                  )}
                </div>

                <div className="space-y-1.5">
                  <label className={ui.label}>รหัสผ่านใหม่ (ไม่บังคับ)</label>
                  <input
                    type="password"
                    value={editForm.password}
                    onChange={(e) => setEditForm({ ...editForm, password: e.target.value })}
                    className={ui.input}
                    placeholder="ใส่เฉพาะตอนต้องการเปลี่ยน (อย่างน้อย 6 ตัว)"
                  />
                  <p className="mt-1 text-[10px] text-slate-500">
                    ถ้าไม่ต้องการเปลี่ยนรหัสผ่าน ให้เว้นว่างไว้
                  </p>
                </div>

                <div className="mt-8 flex gap-3">
                  <button
                    type="button"
                    onClick={() => setEditingUser(null)}
                    className={`${ui.btn} ${ui.btnGhost} flex-1`}
                  >
                    ยกเลิก
                  </button>
                  <button
                    type="submit"
                    disabled={updatingId === editingUser.id}
                    className={`${ui.btn} ${ui.btnAccent} flex-1`}
                  >
                    {updatingId === editingUser.id ? 'กำลังบันทึก...' : 'บันทึกการเปลี่ยนแปลง'}
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
            <div className={`${ui.cardElevated} bg-white shadow-2xl`}>
              <div
                className="flex items-center justify-between border-b p-5"
                style={{ borderColor: 'var(--border)' }}
              >
                <h3 className="text-lg font-semibold text-slate-900">เพิ่มผู้ใช้งาน</h3>
                <button
                  onClick={() => setCreating(false)}
                  className="text-slate-400 hover:text-slate-600"
                >
                  <IconClose />
                </button>
              </div>

              <form onSubmit={handleCreate} className="p-6 space-y-4">
                <div className="space-y-1.5">
                  <label className={ui.label}>ชื่อ-นามสกุล</label>
                  <input
                    required
                    type="text"
                    value={createForm.name}
                    onChange={(e) => setCreateForm({ ...createForm, name: e.target.value })}
                    className={ui.input}
                    placeholder="ระบุชื่อผู้ใช้งาน"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className={ui.label}>อีเมล</label>
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
                  <label className={ui.label}>รหัสผ่าน</label>
                  <input
                    required
                    type="password"
                    value={createForm.password}
                    onChange={(e) => setCreateForm({ ...createForm, password: e.target.value })}
                    className={ui.input}
                    placeholder="อย่างน้อย 4-6 ตัว"
                  />
                  <p className="mt-1 text-[10px] text-slate-500">
                    แนะนำให้ตั้งรหัสผ่านยาวและคาดเดายาก
                  </p>
                </div>

                <div className="space-y-1.5">
                  <label className={ui.label}>สิทธิ์การใช้งาน</label>
                  <select
                    value={createForm.role}
                    onChange={(e) =>
                      setCreateForm({
                        ...createForm,
                        role: e.target.value as 'admin' | 'user',
                      })
                    }
                    className={ui.input}
                  >
                    <option value="user">User (ผู้ใช้งานทั่วไป)</option>
                    <option value="admin">Admin (ผู้ดูแลระบบ)</option>
                  </select>
                </div>

                <div className="mt-8 flex gap-3">
                  <button
                    type="button"
                    onClick={() => setCreating(false)}
                    className={`${ui.btn} ${ui.btnGhost} flex-1`}
                    disabled={updatingId === 'creating'}
                  >
                    ยกเลิก
                  </button>
                  <button
                    type="submit"
                    className={`${ui.btn} ${ui.btnAccent} flex-1`}
                    disabled={updatingId === 'creating'}
                  >
                    {updatingId === 'creating' ? 'กำลังสร้าง...' : 'สร้างผู้ใช้'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
