import type { Language } from '../products/products.types.ts'

interface RouteMessages {
  home: string
  shop: string
  about: string
  shipping: string
  signup: string
  pages: string
  loading: string
  error: string
  missing: string
  notFound: string
  notFoundDescription: string
  back: string
  retry: string
  shippingDescription: string
  shippingDemo: string
  skip: string
}

export const routeMessages: Record<Language, RouteMessages> = {
  en: {
    home: 'Home',
    shop: 'Shop',
    about: 'About YANINDA',
    shipping: 'Shipping',
    signup: 'Sign up',
    pages: 'Explore YANINDA',
    loading: 'Loading…',
    error: 'The product could not be loaded.',
    missing: 'This product is not available.',
    notFound: 'Page not found',
    notFoundDescription:
      'This address does not match a page. Continue exploring the collection.',
    back: 'Back to shop',
    retry: 'Try again',
    shippingDescription:
      'The shopping bag shows how much remains before the $100 free-shipping threshold. Product prices and totals are displayed in USD.',
    shippingDemo:
      'This is a demonstration storefront. Checkout does not create an order, collect payment, or arrange delivery. No delivery dates or shipping charges are promised.',
    skip: 'Skip to main content',
  },
  ar: {
    home: 'الرئيسية',
    shop: 'المتجر',
    about: 'عن يانيندا',
    shipping: 'الشحن',
    signup: 'التسجيل',
    pages: 'استكشف يانيندا',
    loading: 'جارٍ التحميل…',
    error: 'تعذّر تحميل المنتج.',
    missing: 'هذا المنتج غير متاح.',
    notFound: 'الصفحة غير موجودة',
    notFoundDescription: 'هذا العنوان لا يطابق أي صفحة. تابع استكشاف التشكيلة.',
    back: 'العودة إلى المتجر',
    retry: 'حاول مرة أخرى',
    shippingDescription:
      'توضح حقيبة التسوق المبلغ المتبقي للوصول إلى حد الشحن المجاني البالغ 100 دولار. تُعرض أسعار المنتجات والإجماليات بالدولار الأمريكي.',
    shippingDemo:
      'هذا متجر تجريبي. لا يُنشئ إتمام الشراء طلبًا، ولا يحصّل دفعات أو يرتب توصيلًا. لا توجد مواعيد توصيل أو رسوم شحن مضمونة.',
    skip: 'انتقل إلى المحتوى الرئيسي',
  },
  tr: {
    home: 'Ana sayfa',
    shop: 'Mağaza',
    about: 'YANINDA hakkında',
    shipping: 'Kargo',
    signup: 'Kayıt ol',
    pages: 'YANINDA’yı keşfet',
    loading: 'Yükleniyor…',
    error: 'Ürün yüklenemedi.',
    missing: 'Bu ürün mevcut değil.',
    notFound: 'Sayfa bulunamadı',
    notFoundDescription:
      'Bu adres bir sayfayla eşleşmiyor. Koleksiyonu keşfetmeye devam edin.',
    back: 'Mağazaya dön',
    retry: 'Tekrar dene',
    shippingDescription:
      'Alışveriş çantası, 100 dolarlık ücretsiz kargo eşiğine kalan tutarı gösterir. Ürün fiyatları ve toplamlar ABD doları cinsindedir.',
    shippingDemo:
      'Bu bir demo mağazadır. Ödeme işlemi sipariş oluşturmaz, ödeme almaz veya teslimat düzenlemez. Teslimat tarihi veya kargo ücreti taahhüt edilmez.',
    skip: 'Ana içeriğe geç',
  },
}
