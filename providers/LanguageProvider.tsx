"use client";

import {
  createContext,
  useContext,
} from "react";

type ContextType = {
  language: string;
};

export const LanguageContext =
  createContext<ContextType>({
    language: "en",
  });

export function useLanguage() {
  return useContext(
    LanguageContext
  );
}