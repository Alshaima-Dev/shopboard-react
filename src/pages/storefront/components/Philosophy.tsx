import { useTranslation } from '../../../features/i18n/useLanguage.ts'
import { BrandMark } from '../../../shared/ui/BrandMark.tsx'

export function Philosophy() {
  const { t } = useTranslation()
  return (
    <section
      className="philosophy wrap"
      id="philosophy"
      aria-labelledby="philosophy-title"
    >
      <span className="sun brand-mark" data-brand-mark="" aria-hidden="true">
        <BrandMark />
      </span>
      <span className="eyebrow" data-i18n="philosophyEyebrow">
        {t('philosophyEyebrow')}
      </span>
      <h2 id="philosophy-title" data-i18n="philosophyTitle">
        {t('philosophyTitle')}
      </h2>
      <p data-i18n="philosophyText">{t('philosophyText')}</p>
      <a className="primary" href="#shop">
        <span data-i18n="discover">{t('discover')}</span>
        <span className="direction-icon" aria-hidden="true">
          ↗
        </span>
      </a>
    </section>
  )
}
