import React from "react";
import { useTranslation } from "react-i18next";
import { FiGlobe } from "react-icons/fi";

const LanguageSelector = () => {
  const { i18n } = useTranslation();

  const changeLanguage = (e) => {
    i18n.changeLanguage(e.target.value);
  };

  return (
    <div className="flex items-center space-x-1 border border-gray-300 rounded p-1 text-sm cursor-pointer select-none">
      <FiGlobe className="text-lg" />
      <select
        onChange={changeLanguage}
        value={i18n.language}
        className=" border text-black border-gray-300  rounded p-1 text-sm cursor-pointer outline-none"
        aria-label="Select Language"
      >
        <option value="EN">English</option>
        <option value="BN">বাংলা</option>
        <option value="ES">Español</option>
      </select>
    </div>
  );
};

export default LanguageSelector;
