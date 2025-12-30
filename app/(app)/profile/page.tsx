"use client";

import { useAuth } from "@/lib/auth";
import { Mail, Shield, User as UserIcon, Save, X } from "lucide-react";
import { useState, useEffect } from "react";
import { useToast } from "@/components/toast/ToastProvider";

export default function ProfilePage() {
  const { user, updateProfile } = useAuth();
  const { toast } = useToast();
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name || "",
        email: user.email || "",
      });
    }
  }, [user]);

  if (!user) {
    return null;
  }

  const initials = user.name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);

  async function handleSave() {
    setLoading(true);
    try {
      await updateProfile(formData);
      toast({ title: "Profile updated successfully", type: "success" });
      setIsEditing(false);
    } catch (error) {
      toast({
        title:
          error instanceof Error ? error.message : "Failed to update profile",
        type: "error",
      });
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="mx-auto max-w-2xl">
      <h1 className="h1 mb-8">User Profile</h1>

      <div className="card-elevated overflow-hidden p-0">
        <div className="bg-gradient-to-r from-blue-600 to-indigo-700 h-32 relative">
          <div className="absolute -bottom-12 left-8">
            {user.avatar_url ? (
              <img
                src={user.avatar_url}
                alt={user.name}
                className="h-24 w-24 rounded-full border-4 border-white shadow-md object-cover bg-white"
              />
            ) : (
              <div className="grid h-24 w-24 place-items-center rounded-full border-4 border-white bg-white shadow-md">
                <div className="grid h-full w-full place-items-center rounded-full bg-slate-100 text-2xl font-bold text-slate-600">
                  {initials}
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="mt-14 px-8 pb-8">
          <div className="flex justify-between items-start mb-6">
            <div>
              {isEditing ? (
                <div className="space-y-2">
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) =>
                      setFormData({ ...formData, name: e.target.value })
                    }
                    className="text-2xl font-bold text-slate-900 border-b border-blue-500 focus:outline-none bg-transparent"
                    placeholder="Your Name"
                  />
                </div>
              ) : (
                <h2 className="text-2xl font-bold text-slate-900">
                  {user.name}
                </h2>
              )}

              <div className="flex items-center gap-2 text-slate-500 mt-1">
                <span className="badge badge-accent uppercase tracking-wider text-[10px]">
                  {user.role}
                </span>
              </div>
            </div>

            {/* Edit button removed temporarily */}
            {/*
            {isEditing ? (
              <div className="flex gap-2">
                <button
                  onClick={() => setIsEditing(false)}
                  disabled={loading}
                  className="btn btn-ghost text-sm gap-2"
                >
                  <X className="w-4 h-4" />
                  Cancel
                </button>
                <button
                  onClick={handleSave}
                  disabled={loading}
                  className="btn btn-primary text-sm gap-2"
                >
                  <Save className="w-4 h-4" />
                  Save
                </button>
              </div>
            ) : (
              <button
                onClick={() => setIsEditing(true)}
                className="btn btn-ghost text-sm"
              >
                Edit Profile
              </button>
            )}
            */}
          </div>

          <div
            className="grid gap-6 border-t pt-6"
            style={{ borderColor: "var(--border)" }}
          >
            <div className="grid gap-1">
              <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
                Account Information
              </label>
            </div>

            <div className="grid sm:grid-cols-2 gap-4">
              <div className="p-4 rounded-xl bg-slate-50 border border-slate-100">
                <div className="flex items-center gap-3 mb-2">
                  <div className="p-2 rounded-lg bg-white border border-slate-100 text-slate-500 shadow-sm">
                    <Mail className="h-4 w-4" />
                  </div>
                  <span className="text-sm font-medium text-slate-500">
                    Email Address
                  </span>
                </div>
                {isEditing ? (
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) =>
                      setFormData({ ...formData, email: e.target.value })
                    }
                    className="w-full bg-white border border-slate-200 rounded px-2 py-1 text-sm font-semibold text-slate-900 focus:border-blue-500 focus:outline-none"
                  />
                ) : (
                  <div className="pl-[3.25rem] text-sm font-semibold text-slate-900 break-all">
                    {user.email}
                  </div>
                )}
              </div>

              <div className="p-4 rounded-xl bg-slate-50 border border-slate-100">
                <div className="flex items-center gap-3 mb-2">
                  <div className="p-2 rounded-lg bg-white border border-slate-100 text-slate-500 shadow-sm">
                    <Shield className="h-4 w-4" />
                  </div>
                  <span className="text-sm font-medium text-slate-500">
                    Role
                  </span>
                </div>
                <div className="pl-[3.25rem] text-sm font-semibold text-slate-900 capitalize">
                  {user.role}
                </div>
              </div>
            </div>

            <div className="p-4 rounded-xl bg-slate-50 border border-slate-100">
              <div className="flex items-center gap-3 mb-2">
                <div className="p-2 rounded-lg bg-white border border-slate-100 text-slate-500 shadow-sm">
                  <UserIcon className="h-4 w-4" />
                </div>
                <span className="text-sm font-medium text-slate-500">
                  Member ID
                </span>
              </div>
              <div className="pl-[3.25rem] text-sm font-mono text-slate-600">
                {user.id}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
