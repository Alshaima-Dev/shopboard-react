import { useTranslation } from '../../../features/i18n/useLanguage.ts'

export function AnnouncementBar() {
  const { t, money } = useTranslation()
  return (
    <div className="announcement wrap">
      <span data-i18n="announcement">{t('announcement')}</span>
      <span id="shipping-offer">
        {t('shippingOffer', { price: money(100) })}
      </span>
    </div>
  )
}
