import { useTranslation } from '../../../features/i18n/useLanguage.ts'
import { BrandMark } from '../../../shared/ui/BrandMark.tsx'

const currentYear = new Date().getFullYear()

export function StoreFooter() {
  const { t } = useTranslation()
  return (
    <footer className="wrap">
      <a
        className="wordmark"
        href="#"
        data-i18n-aria="home"
        aria-label={t('home')}
      >
        <span className="brand-mark" data-brand-mark="" aria-hidden="true">
          <BrandMark />
        </span>
        <span className="brand-name" lang="en" dir="ltr">
          YANINDA
        </span>
      </a>
      <p data-i18n="footerTagline">{t('footerTagline')}</p>
      <small id="footer-copy">{t('footer', { year: currentYear })}</small>
    </footer>
  )
}
