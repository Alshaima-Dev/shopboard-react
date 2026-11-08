import { Philosophy } from '../storefront/components/Philosophy.tsx'
import { useLanguage } from '../../features/i18n/useLanguage.ts'
import { routeMessages } from '../../features/i18n/routes.messages.ts'

export function AboutPage() {
  const { language } = useLanguage()
  return (
    <>
      <h1 className="wrap route-title">{routeMessages[language].about}</h1>
      <Philosophy />
    </>
  )
}
