import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import LanguageDetector from "i18next-browser-languagedetector";

const resources = {
  en: {
    translation: {
      // Navbar
      home: "Home",
      shop: "Shop",
      categories: "Categories",
      faq: "FAQ",
      about: "About",
      dashboard: "Dashboard",
      joinUs: "Join Us",
      logout: "Logout",
      profile: "Profile",
      updateProfile: "Update Profile",
      openMenu: "Open menu",
      closeMenu: "Close menu",
      // TopBar
      tagline: "Your Health, Our Priority",
      freeDelivery: "Free delivery on orders over ৳500",
      // Loader
      loadingInventory: "Loading Inventory...",
      // Cart
      cart: "Cart",
      // User menu
      openSettings: "Open settings",
      // Footer/other (nijer moto kore baran)
      allRightsReserved: "All rights reserved",
      contactUs: "Contact Us",
      logoutSuccess: "Logout Successfully",
    },
  },
  bn: {
    translation: {
      home: "হোম",
      shop: "দোকান",
      categories: "ক্যাটাগরি",
      faq: "সাধারণ প্রশ্ন",
      about: "আমাদের সম্পর্কে",
      dashboard: "ড্যাশবোর্ড",
      joinUs: "যোগ দিন",
      tagline: "আপনার স্বাস্থ্য, আমাদের অঙ্গীকার",
      freeDelivery: "৳৫০০ এর বেশি অর্ডারে ফ্রি ডেলিভারি",
      logout: "লগআউট",
      profile: "প্রোফাইল",
      updateProfile: "প্রোফাইল আপডেট",
      openMenu: "মেনু খুলুন",
      closeMenu: "মেনু বন্ধ করুন",
      loadingInventory: "ইনভেন্টরি লোড হচ্ছে...",
      cart: "কার্ট",
      openSettings: "সেটিংস খুলুন",
      allRightsReserved: "সর্বস্বত্ব সংরক্ষিত",
      contactUs: "যোগাযোগ করুন",
      logoutSuccess: "সফলভাবে লগআউট হয়েছে",
    },
  },
  es: {
    translation: {
      home: "Inicio",
      shop: "Tienda",
      categories: "Categorías",
      faq: "Preguntas frecuentes",
      about: "Acerca de",
      dashboard: "Panel",
      joinUs: "Únete",
      logout: "Cerrar sesión",
      profile: "Perfil",
      updateProfile: "Actualizar Perfil",
      openMenu: "Abrir menú",
      closeMenu: "Cerrar menú",
      tagline: "Tu Salud, Nuestra Prioridad",
      freeDelivery: "Envío gratis en pedidos superiores a ৳500",
      loadingInventory: "Cargando inventario...",
      cart: "Carrito",
      openSettings: "Abrir ajustes",
      allRightsReserved: "Todos los derechos reservados",
      contactUs: "Contáctanos",
      logoutSuccess: "Sesión cerrada con éxito",
    },
  },
};

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources,
    fallbackLng: "en",
    supportedLngs: ["en", "bn", "es"],
    load: "languageOnly",
    debug: false,
    interpolation: { escapeValue: false },
    detection: {
      order: ["localStorage", "navigator", "htmlTag"],
      caches: ["localStorage"],
    },
  });

export default i18n;
