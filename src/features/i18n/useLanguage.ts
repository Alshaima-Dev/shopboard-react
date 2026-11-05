import { useContext } from 'react'
import { LanguageContext } from './language.context.ts'
import { translate, formatPrice, formatNumber, getProductText } from './i18n.ts'
import type { TranslationValues } from './i18n.ts'
import type { Language, Product } from '../products/products.types.ts'
import { catalogMessages } from './catalog.messages.ts'

export function useLanguage() {
  return useContext(LanguageContext)
}

export function getLocalization(language: Language) {
  return {
    catalogText: catalogMessages[language],
    t: (key: string, values?: TranslationValues) =>
      translate(language, key, values),
    money: (value: number) => formatPrice(value, language),
    number: (value: number) => formatNumber(value, language),
    textFor: (product: Product) => getProductText(product, language),
  }
}

export function useTranslation() {
  return getLocalization(useLanguage().language)
}
