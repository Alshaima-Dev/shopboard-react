import { languages, translate } from './i18n.ts'
import type { Language } from '../products/products.types.ts'

export function applyDocumentLanguage(target: Document, language: Language): void {
  target.documentElement.lang = language
  target.documentElement.dir = languages[language].dir
  target.title = translate(language, 'title')
  target.querySelector('meta[name="description"]')?.setAttribute('content', translate(language, 'meta'))
}
