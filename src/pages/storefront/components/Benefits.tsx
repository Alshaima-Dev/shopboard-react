import { useTranslation } from '../../../features/i18n/useLanguage.ts'
import { Icon } from '../../../shared/ui/Icon.tsx'

export function Benefits() {
 const { t } = useTranslation()
 return (
<div className="benefits wrap">
          <div>
            <span data-benefit-icon="sparkles" aria-hidden="true"><Icon name="sparkles" size={24} /></span><b data-i18n="benefitDesign">{t('benefitDesign')}</b><small data-i18n="benefitDesignText">{t('benefitDesignText')}</small>
          </div>
          <div>
            <span data-benefit-icon="Bags" aria-hidden="true"><Icon name="Bags" size={24} /></span><b data-i18n="benefitLast">{t('benefitLast')}</b><small data-i18n="benefitLastText"
              >{t('benefitLastText')}</small>
          </div>
          <div>
            <span data-benefit-icon="heart" aria-hidden="true"><Icon name="heart" size={24} /></span><b data-i18n="benefitPersonal">{t('benefitPersonal')}</b><small data-i18n="benefitPersonalText"
              >{t('benefitPersonalText')}</small>
          </div>
          <div>
            <span data-benefit-icon="bow" aria-hidden="true"><Icon name="bow" size={24} /></span><b data-i18n="benefitCare">{t('benefitCare')}</b><small data-i18n="benefitCareText"
              >{t('benefitCareText')}</small>
          </div>
        </div>
        
 )
}
