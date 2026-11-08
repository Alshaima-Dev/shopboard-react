import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { checkoutSchema, checkoutDefaults } from '../checkout.schema.ts'
import type { CheckoutValues, CheckoutFieldName } from '../checkout.schema.ts'
import { completeDemoCheckout } from '../checkout.logic.ts'
import type { DemoCheckoutReceipt } from '../checkout.logic.ts'
import type { Product } from '../../products/products.types.ts'
import type { CartController } from '../../cart/useCart.ts'
import { useLanguage } from '../../i18n/useLanguage.ts'
import {
  checkoutMessages,
  checkoutErrorMessage,
} from '../../i18n/checkout.messages.ts'
import { Input } from '../../../shared/ui/shadcn/Input.tsx'
import { Button } from '../../../shared/ui/shadcn/Button.tsx'

interface CheckoutFieldDefinition {
  name: CheckoutFieldName
  type: 'text' | 'email' | 'tel'
  autoComplete: string
}

const fields: CheckoutFieldDefinition[] = [
  { name: 'fullName', type: 'text', autoComplete: 'name' },
  { name: 'email', type: 'email', autoComplete: 'email' },
  { name: 'phone', type: 'tel', autoComplete: 'tel' },
  { name: 'address', type: 'text', autoComplete: 'street-address' },
  { name: 'city', type: 'text', autoComplete: 'address-level2' },
  { name: 'postalCode', type: 'text', autoComplete: 'postal-code' },
  { name: 'country', type: 'text', autoComplete: 'country-name' },
]

export interface CheckoutFormProps {
  cart: CartController
  catalog: readonly Product[]
  onComplete: (receipt: DemoCheckoutReceipt) => void
}

export function CheckoutForm({ cart, catalog, onComplete }: CheckoutFormProps) {
  const { language } = useLanguage()
  const text = checkoutMessages[language]
  const form = useForm<CheckoutValues>({
    resolver: zodResolver(checkoutSchema),
    defaultValues: checkoutDefaults,
  })
  const { errors, isSubmitting } = form.formState
  function submit() {
    if (
      !completeDemoCheckout(
        catalog,
        cart.getQuantities,
        () => form.reset(),
        onComplete,
      )
    ) {
      form.setError('root.cart', { type: 'cart', message: 'empty' })
      return
    }
  }
  const acknowledgementError = checkoutErrorMessage(
    errors.demoAcknowledged?.message,
    language,
  )
  return (
    <form
      className="checkout-form"
      noValidate
      onSubmit={form.handleSubmit(submit)}
      aria-labelledby="checkout-form-title"
      aria-describedby="checkout-demo-note checkout-form-note"
      aria-busy={isSubmitting}
    >
      <h2 id="checkout-form-title">{text.formTitle}</h2>
      <p id="checkout-form-note">{text.requiredNote}</p>
      <fieldset disabled={isSubmitting}>
        <legend className="sr-only">{text.formTitle}</legend>
        <div className="checkout-fields">
          {fields.map((field) => {
            const id = `checkout-${field.name}`
            const error = checkoutErrorMessage(
              errors[field.name]?.message,
              language,
            )
            return (
              <div className="checkout-field" key={field.name}>
                <label htmlFor={id}>{text.fields[field.name]}</label>
                <Input
                  {...form.register(field.name)}
                  id={id}
                  type={field.type}
                  autoComplete={field.autoComplete}
                  dir={
                    field.type === 'email' || field.type === 'tel'
                      ? 'ltr'
                      : undefined
                  }
                  aria-invalid={Boolean(error)}
                  aria-describedby={error ? `${id}-error` : undefined}
                />
                {error && (
                  <p className="checkout-error" id={`${id}-error`} role="alert">
                    {error}
                  </p>
                )}
              </div>
            )
          })}
        </div>
        <div className="checkout-acknowledgement">
          <input
            id="checkout-demo"
            type="checkbox"
            {...form.register('demoAcknowledged')}
            aria-invalid={Boolean(acknowledgementError)}
            aria-describedby={
              acknowledgementError
                ? 'checkout-demo-note checkout-demo-error'
                : 'checkout-demo-note'
            }
          />
          <label htmlFor="checkout-demo">{text.acknowledge}</label>
        </div>
        {acknowledgementError && (
          <p className="checkout-error" id="checkout-demo-error" role="alert">
            {acknowledgementError}
          </p>
        )}
        {errors.root?.cart && (
          <p className="checkout-error" role="alert">
            {text.empty}
          </p>
        )}
        <Button
          className="checkout-submit"
          type="submit"
          disabled={isSubmitting}
        >
          {isSubmitting ? text.submitting : text.submit}
        </Button>
      </fieldset>
      <p role="status" aria-live="polite">
        {isSubmitting ? text.submitting : ''}
      </p>
    </form>
  )
}
