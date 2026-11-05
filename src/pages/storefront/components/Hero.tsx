import { useTranslation } from '../../../features/i18n/useLanguage.ts'
import { BrandMark } from '../../../shared/ui/BrandMark.tsx'
import { CampaignImage } from './CampaignImage.tsx'

export function Hero() {
  const { t } = useTranslation()
  return (
    <section className="hero wrap" aria-labelledby="hero-title">
      <div className="hero-copy">
        <span className="eyebrow" data-i18n="heroEyebrow">
          {t('heroEyebrow')}
        </span>
        <h1 id="hero-title">
          <span data-i18n="heroFirst">{t('heroFirst')}</span>
          <br />
          <em data-i18n="heroSecond">{t('heroSecond')}</em>
        </h1>
        <p data-i18n="heroDescription">{t('heroDescription')}</p>
        <a href="#shop" className="primary">
          <span data-i18n="heroAction">{t('heroAction')}</span>
          <span className="direction-icon" aria-hidden="true">
            ↗
          </span>
        </a>
        <div className="hero-foot">
          <span className="brand-mark" data-brand-mark="" aria-hidden="true">
            <BrandMark />
          </span>
          <span data-i18n="heroFoot">{t('heroFoot')}</span>
        </div>
      </div>
      <div className="hero-image">
        <CampaignImage />
      </div>
    </section>
  )
}
