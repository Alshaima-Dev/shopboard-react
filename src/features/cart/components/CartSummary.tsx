import type { CartController } from '../useCart.ts'
import { useTranslation } from '../../i18n/useLanguage.ts'

export interface CartSummaryProps {
  cart: CartController
}

export function CartSummary({ cart }: CartSummaryProps) {
  const { t, money } = useTranslation()
  if (!cart.items.length)
    return (
      <button
        type="button"
        id="keep-shopping"
        className="primary"
        onClick={cart.close}
      >
        {t('keepShopping')}
      </button>
    )
  return (
    <>
      <div className="subtotal">
        <span>{t('subtotal')}</span>
        <bdi>{money(cart.total)}</bdi>
      </div>
      <p className="shipping">
        {cart.total >= 100
          ? t('freeShipping')
          : t('awayShipping', { price: money(100 - cart.total) })}
      </p>
      <button
        type="button"
        id="checkout"
        className="primary checkout"
        onClick={cart.checkout}
      >
        {t('checkout')}
      </button>
      <p className="demo-note">{t('demoNote')}</p>
      <button
        type="button"
        id="clear-cart"
        className="clear-cart"
        onClick={cart.requestClear}
      >
        {t('clearCart')}
      </button>
      {cart.confirmClear && (
        <div
          className="clear-confirmation"
          role="group"
          aria-labelledby="clear-question"
        >
          <p id="clear-question">{t('clearQuestion')}</p>
          <button
            type="button"
            id="confirm-clear"
            className="primary"
            onClick={cart.confirmClearCart}
          >
            {t('confirmClear')}
          </button>
          <button type="button" id="cancel-clear" onClick={cart.cancelClear}>
            {t('cancel')}
          </button>
        </div>
      )}
    </>
  )
}
