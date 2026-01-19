"use client";

import { useTranslation } from "react-i18next";
import { Languages, Check } from "lucide-react";
import { useState, useRef, useEffect } from "react";

export function LanguageChanger({ className }: { className?: string }) {
  const { i18n } = useTranslation();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const changeLanguage = (lang: string) => {
    i18n.changeLanguage(lang);
    setIsOpen(false);
  };

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`grid h-10 w-10 place-items-center rounded-xl border transition relative ${
          className || "border-slate-200 text-slate-600 hover:bg-slate-50"
        }`}
      >
        <Languages size={20} />
      </button>

      {isOpen && (
        <div className="absolute right-0 top-full mt-2 w-40 overflow-hidden rounded-xl border border-slate-200 bg-white shadow-xl z-50 animate-in fade-in zoom-in-95 duration-200">
          <div className="py-1">
            <button
              onClick={() => changeLanguage("th")}
              className="flex w-full items-center justify-between px-4 py-2 text-sm text-slate-700 hover:bg-slate-50 transition-colors"
            >
              <span>🇹🇭 ไทย</span>
              {i18n.language === "th" && (
                <Check size={16} className="text-emerald-500" />
              )}
            </button>
            <button
              onClick={() => changeLanguage("en")}
              className="flex w-full items-center justify-between px-4 py-2 text-sm text-slate-700 hover:bg-slate-50 transition-colors"
            >
              <span>🇬🇧 English</span>
              {i18n.language === "en" && (
                <Check size={16} className="text-emerald-500" />
              )}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
