import type { Language } from '../products/products.types.ts'

export interface CatalogMessages {
  loading: string
  error: string
  empty: string
  retry: string
  noProducts: string
}

// Assignment-specific feedback; original translation dictionaries stay intact.
export const catalogMessages: Record<Language, CatalogMessages> = {
  en: {
    loading: 'Refreshing products. The current collection remains available.',
    error: 'Products could not be refreshed. Showing the saved collection.',
    empty: 'The API returned no products. Showing the saved collection.',
    retry: 'Try again',
    noProducts: 'No products are available.',
  },
  ar: {
    loading: 'جارٍ تحديث المنتجات. تبقى التشكيلة الحالية متاحة.',
    error: 'تعذّر تحديث المنتجات. يتم عرض التشكيلة المحفوظة.',
    empty: 'لم تُرجع الخدمة أي منتجات. يتم عرض التشكيلة المحفوظة.',
    retry: 'حاول مرة أخرى',
    noProducts: 'لا توجد منتجات متاحة.',
  },
  tr: {
    loading: 'Ürünler yenileniyor. Mevcut koleksiyon kullanılabilir.',
    error: 'Ürünler yenilenemedi. Kayıtlı koleksiyon gösteriliyor.',
    empty: 'API ürün döndürmedi. Kayıtlı koleksiyon gösteriliyor.',
    retry: 'Tekrar dene',
    noProducts: 'Şu anda ürün bulunmuyor.',
  },
}
