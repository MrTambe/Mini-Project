"use client";

import { useCallback, useState, useEffect } from "react";
import { LANGUAGE_LABELS, LANGUAGE_FLAGS, DEFAULT_LANGUAGE, getTranslation, type Language } from "@/lib/i18n";

const STORAGE_KEY = "eventure-language";

export function useTranslation() {
  const [language, setLanguageState] = useState<Language>(DEFAULT_LANGUAGE);

  // Load saved language from localStorage on mount
  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY) as Language | null;
    if (saved && saved in LANGUAGE_LABELS) {
      setLanguageState(saved);
    }
  }, []);

  const setLanguage = useCallback((next: Language) => {
    setLanguageState(next);
    localStorage.setItem(STORAGE_KEY, next);
  }, []);

  const t = useCallback(
    (key: keyof typeof import("@/lib/i18n").en) => {
      return getTranslation(language, key);
    },
    [language]
  );

  return {
    language,
    setLanguage,
    t,
    labels: LANGUAGE_LABELS,
    flags: LANGUAGE_FLAGS,
    isRTL: false, // Hindi and Marathi are LTR scripts (Devanagari)
  };
}
