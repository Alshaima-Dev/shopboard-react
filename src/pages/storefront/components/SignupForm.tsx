import { useTranslation } from '../../../features/i18n/useLanguage.ts'
import { submitSignupDemo } from '../../../features/signup/signup.submit.ts'

export interface SignupFormProps {
  onSuccess: () => void
}

export function SignupForm({ onSuccess }: SignupFormProps) {
 const { t } = useTranslation()
 return (
<section className="signup wrap" id="signup" aria-labelledby="signup-title">
          <h2 id="signup-title" data-i18n="signupTitle">{t('signupTitle')}</h2>
          <p id="signup-note" className="signup-note" data-i18n="signupNote">{t('signupNote')}</p>
          <form
            id="signup-form" onSubmit={event => submitSignupDemo(event, onSuccess)}
            method="post"
            aria-labelledby="signup-title"
            aria-describedby="signup-note"
          >
            <div className="signup-field">
              <label htmlFor="signup-email" data-i18n="signupEmail"
                >{t('signupEmail')}</label>
              <input
                id="signup-email"
                name="email"
                type="email"
                autoComplete="email"
                dir="ltr"
                required
              />
            </div>
            <div className="signup-field">
              <label htmlFor="signup-password" data-i18n="signupPassword"
                >{t('signupPassword')}</label>
              <input
                id="signup-password"
                name="password"
                type="password"
                autoComplete="new-password"
                minLength={8}
                aria-describedby="signup-password-hint"
                required
              />
              <small id="signup-password-hint" data-i18n="signupPasswordHint"
                >{t('signupPasswordHint')}</small>
            </div>
            <button className="primary" type="submit">
              <span data-i18n="signupSubmit">{t('signupSubmit')}</span>
            </button>
          </form>
        </section>
 )
}
