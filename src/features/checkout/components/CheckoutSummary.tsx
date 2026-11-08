import type { CartController } from '../../cart/useCart.ts'
import { CartItem } from '../../cart/components/CartItem.tsx'
import { useTranslation } from '../../i18n/useLanguage.ts'

export interface CheckoutSummaryProps {
  cart: CartController
}

export function CheckoutSummary({ cart }: CheckoutSummaryProps) {
  const { t, money } = useTranslation()
  return (
    <aside className="checkout-summary" aria-labelledby="checkout-bag-title">
      <h2 id="checkout-bag-title">{t('cartTitle')}</h2>
      <ul>
        {cart.items.map((product) => (
          <li key={product.id}>
            <CartItem
              product={product}
              quantity={cart.quantities[product.id]}
              changeQuantity={cart.changeQuantity}
              removeItem={cart.removeItem}
            />
          </li>
        ))}
      </ul>
      <div className="subtotal">
        <span>{t('subtotal')}</span>
        <bdi>{money(cart.total)}</bdi>
      </div>
      <p>
        {cart.total >= 100
          ? t('freeShipping')
          : t('awayShipping', { price: money(100 - cart.total) })}
      </p>
    </aside>
  )
}
