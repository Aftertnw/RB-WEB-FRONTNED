"use client";

import React from "react";

interface LoadingOverlayProps {
  isLoading: boolean;
  message?: string;
}

export default function LoadingOverlay({
  isLoading,
  message = "กำลังบันทึกข้อมูล...",
}: LoadingOverlayProps) {
  if (!isLoading) return null;

  return (
    <div className="fixed inset-0 z-[9999] flex flex-col items-center justify-center bg-slate-900/60 backdrop-blur-sm">
      <div className="flex flex-col items-center gap-4 rounded-2xl bg-white p-8 shadow-2xl animate-in zoom-in-95 duration-200">
        <div className="relative h-12 w-12">
          <div className="absolute h-12 w-12 animate-spin rounded-full border-4 border-slate-100 border-t-blue-600" />
        </div>
        <div className="text-sm font-semibold text-slate-700 animate-pulse">
          {message}
        </div>
      </div>
    </div>
  );
}
