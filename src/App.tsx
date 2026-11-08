import { AppRoutes } from './pages/AppRoutes.tsx'
import { LanguageProvider } from './features/i18n/LanguageProvider.tsx'
import { CartProvider } from './features/cart/CartProvider.tsx'
import { useToast } from './shared/ui/useToast.ts'
export function App() {
  const toast = useToast()
  return (
    <LanguageProvider>
      <CartProvider notify={toast.notify}>
        <AppRoutes
          notice={toast.notice}
          onSignupSuccess={() => toast.notify('signupSuccess')}
        />
      </CartProvider>
    </LanguageProvider>
  )
}
