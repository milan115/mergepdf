import { createContext, useContext } from "react";
import { useTranslation } from "next-i18next";

const AppContext = createContext();

export function LangAppWrapper({ children }) {
  const { t, i18n } = useTranslation();
  let sharedState = { t, i18n };

  return (
    <AppContext.Provider value={sharedState}>{children}</AppContext.Provider>
  );
}

export function useAppContext() {
  return useContext(AppContext);
}
