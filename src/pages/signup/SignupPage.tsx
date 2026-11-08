import { SignupForm } from '../storefront/components/SignupForm.tsx'
import { useStorefrontContext } from '../layout/storefront.context.ts'
import { useLanguage } from '../../features/i18n/useLanguage.ts'
import { routeMessages } from '../../features/i18n/routes.messages.ts'

export function SignupPage() {
  const { onSignupSuccess } = useStorefrontContext()
  const { language } = useLanguage()
  return (
    <>
      <h1 className="wrap route-title">{routeMessages[language].signup}</h1>
      <SignupForm onSuccess={onSignupSuccess} />
    </>
  )
}
