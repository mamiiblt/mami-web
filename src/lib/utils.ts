import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import ISO6391 from "iso-639-1";

export function getBannerUrl(articleIdNum: number): string {
  return `https://raw.githubusercontent.com/instafel/images/refs/heads/main/marc/P${articleIdNum}.png`
}

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatDate(date: string, localeCode = "en-US") {
  return new Date(date).toLocaleDateString(localeCode, {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

export function formatISODate(date: Date) {
  return date.toISOString().split("T")[0];
}

export function getLanguageDisplayName(languageCode: string, displayLocale = "en"): string {
  if (!languageCode) return "";

  const code = languageCode.trim().replace(/_/g, "-");
  const splittedLangCode = code.split("-");
  const base = splittedLangCode[0]
  const region = splittedLangCode[1]

  try {
    const dn = new Intl.DisplayNames([displayLocale], { type: "language" });
    var name = ""
    if (base.toLowerCase() == region.toLowerCase() || base == "en") {
      name = dn.of(base)
    } else {
      name = dn.of(code)
    }
    if (name) return capitalizeFirstLetter(name, displayLocale);
  } catch {
    const name = ISO6391.getName(base) || ISO6391.getNativeName(base);
    if (name) return capitalizeFirstLetter(name, displayLocale);
    return code;
  }
}

function capitalizeFirstLetter(str: string, locale = "en"): string {
  return str
      ? str[0].toLocaleUpperCase(locale) + str.slice(1)
      : "";
}