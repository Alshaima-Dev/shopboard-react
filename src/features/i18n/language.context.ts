import { createContext } from 'react'
import type { Language } from '../products/products.types.ts'

export interface LanguageContextValue {
  language: Language
  setLanguage: (value: unknown) => void
}

// Standalone presentation components default to English; the app has one owner.
export const LanguageContext = createContext<LanguageContextValue>({ language: 'en', setLanguage: () => {} })
