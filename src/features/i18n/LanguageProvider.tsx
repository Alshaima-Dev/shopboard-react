import { useEffect, useState } from 'react'
import type { ReactNode } from 'react'
import { languageStore } from './i18n.state.ts'
import { LanguageContext } from './language.context.ts'
import { applyDocumentLanguage } from './language.document.ts'

export interface LanguageProviderProps {
  children: ReactNode
  store?: typeof languageStore
}

export function LanguageProvider({
  children,
  store = languageStore,
}: LanguageProviderProps) {
  const [language, setCurrentLanguage] = useState(() => store.getLanguage())
  useEffect(() => {
    applyDocumentLanguage(document, language)
  }, [language])
  function setLanguage(value: unknown) {
    setCurrentLanguage(store.setLanguage(value))
  }
  return (
    <LanguageContext value={{ language, setLanguage }}>
      {children}
    </LanguageContext>
  )
}
