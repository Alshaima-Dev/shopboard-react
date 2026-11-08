import type { Language } from '../products/products.types.ts'

interface FeedbackMessages {
  pageTitle: string
  pageError: string
  cartTitle: string
  cartError: string
  retry: string
  reload: string
  back: string
}

export const feedbackMessages: Record<Language, FeedbackMessages> = {
  en: {
    pageTitle: 'This page could not be shown',
    pageError:
      'Try loading this page again, or continue to another page. Your saved bag is retained. Reloading may be necessary after a site update; unsaved form details will be lost.',
    cartTitle: 'The bag dialog could not be shown',
    cartError:
      'Your bag contents are retained. Try opening the dialog again, or continue to demo checkout.',
    retry: 'Try again',
    reload: 'Reload page',
    back: 'Back to shop',
  },
  ar: {
    pageTitle: 'تعذّر عرض هذه الصفحة',
    pageError:
      'حاول تحميل الصفحة مجددًا أو انتقل إلى صفحة أخرى. ستبقى حقيبتك المحفوظة. قد تحتاج إلى إعادة تحميل الموقع بعد تحديثه؛ ستفقد بيانات النموذج غير المحفوظة.',
    cartTitle: 'تعذّر عرض نافذة الحقيبة',
    cartError:
      'محتويات حقيبتك محفوظة. حاول فتح النافذة مجددًا أو تابع إلى إتمام الشراء التجريبي.',
    retry: 'حاول مرة أخرى',
    reload: 'إعادة تحميل الصفحة',
    back: 'العودة إلى المتجر',
  },
  tr: {
    pageTitle: 'Bu sayfa gösterilemedi',
    pageError:
      'Sayfayı yeniden yüklemeyi deneyin veya başka bir sayfaya geçin. Kayıtlı çantanız korunur. Site güncellemesinden sonra yeniden yükleme gerekebilir; kaydedilmemiş form bilgileri kaybolur.',
    cartTitle: 'Çanta penceresi gösterilemedi',
    cartError:
      'Çantanızdaki ürünler korunur. Pencereyi yeniden açmayı deneyin veya demo ödeme adımına geçin.',
    retry: 'Tekrar dene',
    reload: 'Sayfayı yeniden yükle',
    back: 'Mağazaya dön',
  },
}
