import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import LanguageDetector from "i18next-browser-languagedetector";

const resources = {
  EN: {
    translation: {
      home: "Home",
      shop: "Shop",
      categories: "Categories",
      joinUs: "Join Us",
      updateProfile: "Update Profile",
      dashboard: "Dashboard",
      logout: "Logout",
      mediStore: "MediStore",
    },
  },
  BN: {
    translation: {
      home: "হোম",
      shop: "দোকান",
      categories: "ক্যাটাগরি",
      joinUs: "যোগ দিন",
      updateProfile: "প্রোফাইল আপডেট",
      dashboard: "ড্যাশবোর্ড",
      logout: "লগআউট",
      mediStore: "মেডিস্টোর",
    },
  },
  ES: {
    translation: {
      home: "Inicio",
      shop: "Tienda",
      categories: "Categorías",
      joinUs: "Únete",
      updateProfile: "Actualizar Perfil",
      dashboard: "Tablero",
      logout: "Cerrar sesión",
      mediStore: "MediStore",
    },
  },
};

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources,
    fallbackLng: "EN",
    debug: false,
    interpolation: {
      escapeValue: false,
    },
    detection: {
      order: ["localStorage", "navigator", "htmlTag", "path", "subdomain"],
      caches: ["localStorage"],
    },
  });

export default i18n;
