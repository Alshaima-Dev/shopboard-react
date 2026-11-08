import { useCallback } from 'react'
import { Link } from 'react-router'
import type { DemoCheckoutReceipt } from '../checkout.logic.ts'
import { useLanguage, useTranslation } from '../../i18n/useLanguage.ts'
import { checkoutMessages } from '../../i18n/checkout.messages.ts'
import { Button } from '../../../shared/ui/shadcn/Button.tsx'

export interface CheckoutSuccessProps {
  receipt: DemoCheckoutReceipt
  onRestart: () => void
}

export function CheckoutSuccess({ receipt, onRestart }: CheckoutSuccessProps) {
  const { language } = useLanguage()
  const { money, number, t } = useTranslation()
  const text = checkoutMessages[language]
  const focusHeading = useCallback(
    (heading: HTMLHeadingElement | null) => heading?.focus(),
    [],
  )
  return (
    <section
      className="wrap route-page checkout-success"
      aria-labelledby="checkout-success-title"
    >
      <h1 id="checkout-success-title" tabIndex={-1} ref={focusHeading}>
        {text.successTitle}
      </h1>
      <p role="status">{text.success}</p>
      <h2>{text.summary}</h2>
      <dl>
        <dt>{text.items}</dt>
        <dd>{number(receipt.count)}</dd>
        <dt>{t('subtotal')}</dt>
        <dd>
          <bdi>{money(receipt.subtotal)}</bdi>
        </dd>
      </dl>
      <div className="checkout-success-actions">
        <Link to="/shop">{text.back}</Link>
        <Button variant="outline" type="button" onClick={onRestart}>
          {text.restart}
        </Button>
      </div>
    </section>
  )
}
