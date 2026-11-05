import { useEffect, useLayoutEffect, useRef } from 'react'
import type { CartController } from '../useCart.ts'
import { useTranslation } from '../../i18n/useLanguage.ts'
import { Icon } from '../../../shared/ui/Icon.tsx'
import { CartItem } from './CartItem.tsx'
import { CartSummary } from './CartSummary.tsx'

export interface CartDialogProps {
  cart: CartController
}

export function CartDialog({ cart }: CartDialogProps) {
  const { t } = useTranslation()
  const dialogRef = useRef<HTMLDialogElement>(null)
  const pendingFocus = useRef<HTMLElement | string | null>(null)
  useEffect(() => {
    const dialog = dialogRef.current
    if (!dialog) return
    if (cart.isOpen && !dialog.open) dialog.showModal()
    if (!cart.isOpen && dialog.open) dialog.close()
  }, [cart.isOpen])
  useLayoutEffect(() => {
    const dialog = dialogRef.current
    const target = pendingFocus.current
    pendingFocus.current = null
    if (!dialog || !target) return
    if (target instanceof HTMLElement && target.isConnected) target.focus()
    else
      (typeof target === 'string'
        ? dialog.querySelector<HTMLElement>(target)
        : null
      )?.focus()
    if (target instanceof HTMLElement && !target.isConnected) {
      ;(
        dialog.querySelector<HTMLElement>('#cart-items button') ||
        dialog.querySelector<HTMLElement>('#keep-shopping')
      )?.focus()
    }
  })
  return (
    <dialog
      id="cart"
      ref={dialogRef}
      aria-labelledby="cart-title"
      onCancel={(event) => {
        event.preventDefault()
        cart.close()
      }}
      onClose={cart.close}
      onClickCapture={(event) => {
        if (!(event.target instanceof Element)) return
        const button = event.target.closest<HTMLElement>('button')
        if (!button) return
        if (button.id === 'clear-cart') pendingFocus.current = '#confirm-clear'
        else if (button.id === 'cancel-clear')
          pendingFocus.current = '#clear-cart'
        else if (button.id === 'confirm-clear')
          pendingFocus.current = '#keep-shopping'
        else if (button.dataset.change || button.dataset.remove)
          pendingFocus.current = button
      }}
      onClick={(event) => {
        if (event.target !== event.currentTarget) return
        const rect = event.currentTarget.getBoundingClientRect()
        if (
          event.clientX < rect.left ||
          event.clientX > rect.right ||
          event.clientY < rect.top ||
          event.clientY > rect.bottom
        )
          cart.close()
      }}
    >
      <div className="cart-heading">
        <h2 id="cart-title">{t('cartTitle')}</h2>
        <button
          type="button"
          id="close-cart"
          aria-label={t('closeBag')}
          onClick={cart.close}
        >
          <Icon name="close" />
        </button>
      </div>
      <div id="cart-items">
        {cart.items.length ? (
          cart.items.map((product) => (
            <CartItem
              key={product.id}
              product={product}
              quantity={cart.quantities[product.id]}
              changeQuantity={cart.changeQuantity}
              removeItem={cart.removeItem}
            />
          ))
        ) : (
          <p className="empty">{t('emptyCart')}</p>
        )}
      </div>
      <div id="cart-bottom">
        <CartSummary cart={cart} />
      </div>
    </dialog>
  )
}
