import { createRetryablePage } from './layout/lazy-page.ts'
import { RoutePage } from './layout/RoutePage.tsx'
import { Route, Routes } from 'react-router'
import { StoreLayout } from './layout/StoreLayout.tsx'
import type { StoreLayoutProps } from './layout/StoreLayout.tsx'

const Home = createRetryablePage(() =>
  import('./storefront/StorefrontPage.tsx').then((module) => ({
    default: module.StorefrontPage,
  })),
)
const Shop = createRetryablePage(() =>
  import('./shop/ShopPage.tsx').then((module) => ({
    default: module.ShopPage,
  })),
)
const About = createRetryablePage(() =>
  import('./about/AboutPage.tsx').then((module) => ({
    default: module.AboutPage,
  })),
)
const Shipping = createRetryablePage(() =>
  import('./shipping/ShippingPage.tsx').then((module) => ({
    default: module.ShippingPage,
  })),
)
const Signup = createRetryablePage(() =>
  import('./signup/SignupPage.tsx').then((module) => ({
    default: module.SignupPage,
  })),
)
const Details = createRetryablePage(() =>
  import('./products/ProductDetailsPage.tsx').then((module) => ({
    default: module.ProductDetailsPage,
  })),
)
const NotFound = createRetryablePage(() =>
  import('./not-found/NotFoundPage.tsx').then((module) => ({
    default: module.NotFoundPage,
  })),
)
const Checkout = createRetryablePage(() =>
  import('./checkout/CheckoutPage.tsx').then((module) => ({
    default: module.CheckoutPage,
  })),
)

export interface AppRoutesProps extends StoreLayoutProps {}

export function AppRoutes(props: AppRoutesProps) {
  return (
    <Routes>
      <Route element={<StoreLayout {...props} />}>
        <Route index element={<RoutePage page={Home} />} />
        <Route path="shop" element={<RoutePage page={Shop} />} />
        <Route path="about" element={<RoutePage page={About} />} />
        <Route path="shipping" element={<RoutePage page={Shipping} />} />
        <Route path="signup" element={<RoutePage page={Signup} />} />
        <Route path="products/:id" element={<RoutePage page={Details} />} />
        <Route path="checkout" element={<RoutePage page={Checkout} />} />
        <Route path="*" element={<RoutePage page={NotFound} />} />
      </Route>
    </Routes>
  )
}
