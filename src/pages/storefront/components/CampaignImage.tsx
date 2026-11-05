import { useTranslation } from '../../../features/i18n/useLanguage.ts'
import { useState } from 'react'

export function CampaignImage() {
  const { t } = useTranslation()
  const [failures, setFailures] = useState(0)
  const base = import.meta.env?.BASE_URL || '/'
  const unavailable = t('imageUnavailable', { name: 'YANINDA' })
  return (
    <>
      <img
        src={
          base +
          (failures
            ? 'images/products/fallback.svg'
            : 'images/brand/yaninda-campaign.jpg')
        }
        width={1200}
        height={1200}
        data-i18n-alt="heroAlt"
        alt={failures ? unavailable : t('heroAlt')}
        fetchPriority="high"
        hidden={failures >= 2}
        onError={() => setFailures((count) => count + 1)}
      />
      {failures >= 2 && <p className="photo-unavailable">{unavailable}</p>}
    </>
  )
}
