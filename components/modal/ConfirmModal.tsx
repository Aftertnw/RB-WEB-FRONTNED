"use client";

import React from "react";
import { ui } from "@/app/ui";

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

export function ConfirmModal(props: {
  open: boolean;
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  danger?: boolean;
  onConfirm: () => void;
  onClose: () => void;
  loading?: boolean;
}) {
  if (!props.open) return null;

  return (
    <div className="fixed inset-0 z-[70] flex items-center justify-center p-4">
      <div
        className="absolute inset-0 bg-slate-900/50 backdrop-blur-sm"
        onClick={props.onClose}
      />

      <div
        className={`${ui.cardElevated} relative w-full max-w-md animate-scaleIn`}
      >
        <div className="p-6">
          {/* Icon */}
          <div
            className={`mx-auto flex h-14 w-14 items-center justify-center rounded-full ${
              props.danger ? "bg-red-100" : "bg-blue-100"
            }`}
          >
            {props.danger ? (
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
            ) : (
              <svg
                width="28"
                height="28"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="text-blue-600"
              >
                <circle cx="12" cy="12" r="10" />
                <line x1="12" y1="16" x2="12" y2="12" />
                <line x1="12" y1="8" x2="12.01" y2="8" />
              </svg>
            )}
          </div>

          {/* Content */}
          <div className="mt-4 text-center">
            <h3 className="text-lg font-semibold text-slate-900">
              {props.title}
            </h3>
            <p className="mt-2 text-sm leading-relaxed text-slate-500">
              {props.message}
            </p>
          </div>

          {/* Actions */}
          <div className="mt-6 flex gap-3">
            <button
              className={`${ui.btn} ${ui.btnGhost} flex-1`}
              onClick={props.onClose}
              disabled={props.loading}
            >
              {props.cancelText || "ยกเลิก"}
            </button>

            <button
              className={`${ui.btn} flex-1 ${
                props.danger ? ui.btnDanger : ui.btnAccent
              }`}
              onClick={props.onConfirm}
              disabled={props.loading}
            >
              {props.loading ? (
                <>
                  <IconLoader />
                  กำลังดำเนินการ...
                </>
              ) : (
                props.confirmText || "ยืนยัน"
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
