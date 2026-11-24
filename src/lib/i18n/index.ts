import en from "./en.json";
import hi from "./hi.json";
import mr from "./mr.json";

export const translations = {
  en,
  hi,
  mr,
} as const;

export type Language = keyof typeof translations;
export type TranslationKey = keyof typeof en;

export const DEFAULT_LANGUAGE: Language = "en";

export const LANGUAGE_LABELS: Record<Language, string> = {
  en: "English",
  hi: "हिन्दी",
  mr: "मराठी",
};

export const LANGUAGE_FLAGS: Record<Language, string> = {
  en: "🇬🇧",
  hi: "🇮🇳",
  mr: "🇮🇳",
};

export function getTranslation(language: Language, key: TranslationKey): string {
  const translation = translations[language];
  const value = translation[key];
  if (typeof value === "string") {
    return value;
  }
  // Fallback to English if the key exists there
  const fallback = en[key];
  if (typeof fallback === "string") {
    return fallback;
  }
  return key;
}
