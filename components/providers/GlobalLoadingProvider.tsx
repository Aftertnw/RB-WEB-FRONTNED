"use client";

import React, { createContext, useContext, useMemo, useState } from "react";
import LoadingOverlay from "@/components/ui/LoadingOverlay";

type Ctx = {
  showLoading: (message?: string) => void;
  hideLoading: () => void;
};

const GlobalLoadingContext = createContext<Ctx | null>(null);

export function GlobalLoadingProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState("กำลังดำเนินการ...");

  const value = useMemo(
    () => ({
      showLoading: (msg?: string) => {
        if (msg) setMessage(msg);
        setIsLoading(true);
      },
      hideLoading: () => setIsLoading(false),
    }),
    []
  );

  return (
    <GlobalLoadingContext.Provider value={value}>
      {children}
      {/* ✅ อยู่ root -> ทับทั้ง browser แน่นอน */}
      <LoadingOverlay isLoading={isLoading} message={message} />
    </GlobalLoadingContext.Provider>
  );
}

export function useGlobalLoading() {
  const ctx = useContext(GlobalLoadingContext);
  if (!ctx)
    throw new Error(
      "useGlobalLoading must be used inside GlobalLoadingProvider"
    );
  return ctx;
}
