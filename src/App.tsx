import { StorefrontPage } from './pages/storefront/StorefrontPage.tsx'
import { LanguageProvider } from './features/i18n/LanguageProvider.tsx'
export function App() { return <LanguageProvider><StorefrontPage /></LanguageProvider> }
