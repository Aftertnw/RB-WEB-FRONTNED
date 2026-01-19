"use client";

import "@/lib/i18n";
import { ReactNode, useEffect } from "react";
import { useTranslation } from "react-i18next";

export function I18nProvider({ children }: { children: ReactNode }) {
  const { t } = useTranslation();

  useEffect(() => {
    document.title = t("sidebar.title");
  }, [t]);

  return <>{children}</>;
}
