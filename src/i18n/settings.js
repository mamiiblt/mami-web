export const fallbackLng = "en";
export const navLanguages = [
  { code: "en", name: "English", flag: "🇬🇧" },
  { code: "tr", name: "Türkçe", flag: "🇹🇷" },
];
export const languages = navLanguages.map((lang) => lang.code);
export const defaultNS = "common";
export const namespaces = ["common", "about", "projects", "blogs"];
export const cookieName = "i18next";
export const headerName = "x-i18next-current-language";
