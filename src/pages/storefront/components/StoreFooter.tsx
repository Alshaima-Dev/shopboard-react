import { Link, NavLink } from 'react-router'
import { useLanguage } from '../../../features/i18n/useLanguage.ts'
import { routeMessages } from '../../../features/i18n/routes.messages.ts'
import { useTranslation } from '../../../features/i18n/useLanguage.ts'
import { BrandMark } from '../../../shared/ui/BrandMark.tsx'

const currentYear = new Date().getFullYear()

export function StoreFooter() {
  const { t } = useTranslation()
  const { language } = useLanguage()
  const text = routeMessages[language]
  return (
    <footer className="wrap">
      <Link
        className="wordmark"
        to="/"
        data-i18n-aria="home"
        aria-label={t('home')}
      >
        <span className="brand-mark" data-brand-mark="" aria-hidden="true">
          <BrandMark />
        </span>
        <span className="brand-name" lang="en" dir="ltr">
          YANINDA
        </span>
      </Link>
      <nav className="route-navigation" aria-label={text.pages}>
        <NavLink to="/" end>
          {text.home}
        </NavLink>
        <NavLink to="/shop">{text.shop}</NavLink>
        <NavLink to="/about">{text.about}</NavLink>
        <NavLink to="/shipping">{text.shipping}</NavLink>
        <NavLink to="/signup">{text.signup}</NavLink>
      </nav>
      <p data-i18n="footerTagline">{t('footerTagline')}</p>
      <small id="footer-copy">{t('footer', { year: currentYear })}</small>
    </footer>
  )
}
