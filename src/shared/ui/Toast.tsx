import { useTranslation } from '../../features/i18n/useLanguage.ts'
import type { MessageKey } from '../../features/i18n/i18n.ts'

export interface ToastProps {
  notice: MessageKey | null
}

export function Toast({ notice }: ToastProps) {
  const { t } = useTranslation()
  return <div className={notice ? 'toast visible' : 'toast'} role="status" aria-live="polite">
    {notice ? t(notice) : ''}
  </div>
}
