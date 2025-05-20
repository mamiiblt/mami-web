import i18next from "i18next";
import LanguageDetector from "i18next-browser-languagedetector";
import resourcesToBackend from "i18next-resources-to-backend";
import { initReactI18next } from "react-i18next/initReactI18next";
import { fallbackLng, languages, defaultNS, namespaces } from "./settings";

const runsOnServerSide = typeof window === "undefined";

i18next
  .use(initReactI18next)
  .use(LanguageDetector)
  .use(
    resourcesToBackend((language, namespace) =>
      import(`../locales/${language}/${namespace}.json`)
    )
  )
  .init({
    debug: process.env.NODE_ENV === "development",
    supportedLngs: languages,
    fallbackLng,
    lng: undefined,
    defaultNS,
    ns: [defaultNS],
    detection: {
      order: ["cookie", "path", "htmlTag", "navigator"],
      caches: ["cookie"],
    },
    preload: runsOnServerSide ? languages : [],
  });

export default i18next;
