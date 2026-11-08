import type { Language } from '../products/products.types.ts'
import type {
  CheckoutErrorCode,
  CheckoutFieldName,
} from '../checkout/checkout.schema.ts'

interface CheckoutMessages {
  title: string
  demo: string
  formTitle: string
  fields: Record<CheckoutFieldName, string>
  requiredNote: string
  acknowledge: string
  submit: string
  submitting: string
  empty: string
  successTitle: string
  success: string
  summary: string
  items: string
  restart: string
  back: string
  errors: Record<CheckoutErrorCode, string>
}

export const checkoutMessages: Record<Language, CheckoutMessages> = {
  en: {
    title: 'Demo checkout',
    demo: 'Try checkout with fictional contact and delivery details. Nothing is sent or saved. No order, payment, or delivery will be created. Do not enter payment-card details.',
    formTitle: 'Contact and delivery details',
    fields: {
      fullName: 'Full name',
      email: 'Email',
      phone: 'Phone (optional)',
      address: 'Street address',
      city: 'City',
      postalCode: 'Postal code',
      country: 'Country',
    },
    requiredNote: 'All fields except phone are required.',
    acknowledge:
      'I understand that this is a demo and no order or payment will be processed.',
    submit: 'Confirm demo checkout',
    submitting: 'Validating demo details…',
    empty: 'Your bag is empty. Add a product before starting checkout.',
    successTitle: 'Demo checkout complete',
    success:
      'Your demo details passed validation. No order was placed, no payment was taken, and no delivery was arranged. Your bag is unchanged. Contact and address details were not sent or saved.',
    summary: 'Demo summary',
    items: 'Items reviewed',
    restart: 'Start another demo',
    back: 'Back to shop',
    errors: {
      name: 'Enter a name with at least two characters.',
      email: 'Enter a valid email address.',
      phone:
        'Enter a phone number with at least seven digits, or leave it blank.',
      address: 'Enter an address with at least three characters.',
      required: 'Complete this field.',
      country: 'Enter a country with at least two characters.',
      tooLong: 'This value is too long. Please shorten it.',
      demoRequired: 'Confirm that you understand this is a demo.',
      invalid: 'Check this field and try again.',
    },
  },
  ar: {
    title: 'إتمام شراء تجريبي',
    demo: 'جرّب إتمام الشراء ببيانات اتصال وتوصيل خيالية. لا تُرسل البيانات ولا تُحفظ. لن يُنشأ طلب أو دفع أو توصيل. لا تدخل بيانات بطاقة دفع.',
    formTitle: 'بيانات الاتصال والتوصيل',
    fields: {
      fullName: 'الاسم الكامل',
      email: 'البريد الإلكتروني',
      phone: 'الهاتف (اختياري)',
      address: 'عنوان الشارع',
      city: 'المدينة',
      postalCode: 'الرمز البريدي',
      country: 'الدولة',
    },
    requiredNote: 'جميع الحقول مطلوبة باستثناء الهاتف.',
    acknowledge: 'أفهم أن هذه تجربة ولن تتم معالجة طلب أو دفع.',
    submit: 'تأكيد التجربة',
    submitting: 'جارٍ التحقق من البيانات التجريبية…',
    empty: 'حقيبتك فارغة. أضف منتجًا قبل بدء إتمام الشراء.',
    successTitle: 'اكتملت تجربة إتمام الشراء',
    success:
      'اجتازت بياناتك التجريبية التحقق. لم يُقدّم طلب ولم يُحصّل دفع ولم يُرتّب توصيل. حقيبتك لم تتغير. لم تُرسل بيانات الاتصال والعنوان ولم تُحفظ.',
    summary: 'ملخص التجربة',
    items: 'القطع التي تمت مراجعتها',
    restart: 'بدء تجربة أخرى',
    back: 'العودة إلى المتجر',
    errors: {
      name: 'أدخل اسمًا من حرفين على الأقل.',
      email: 'أدخل بريدًا إلكترونيًا صالحًا.',
      phone: 'أدخل رقم هاتف من سبعة أرقام على الأقل أو اتركه فارغًا.',
      address: 'أدخل عنوانًا من ثلاثة أحرف على الأقل.',
      required: 'أكمل هذا الحقل.',
      country: 'أدخل دولة من حرفين على الأقل.',
      tooLong: 'هذه القيمة طويلة جدًا. يرجى اختصارها.',
      demoRequired: 'أكد أنك تفهم أن هذه تجربة.',
      invalid: 'تحقق من هذا الحقل وحاول مجددًا.',
    },
  },
  tr: {
    title: 'Demo ödeme adımı',
    demo: 'Kurgusal iletişim ve teslimat bilgileriyle deneyin. Hiçbir bilgi gönderilmez veya kaydedilmez. Sipariş, ödeme veya teslimat oluşturulmaz. Ödeme kartı bilgisi girmeyin.',
    formTitle: 'İletişim ve teslimat bilgileri',
    fields: {
      fullName: 'Ad soyad',
      email: 'E-posta',
      phone: 'Telefon (isteğe bağlı)',
      address: 'Sokak adresi',
      city: 'Şehir',
      postalCode: 'Posta kodu',
      country: 'Ülke',
    },
    requiredNote: 'Telefon dışındaki tüm alanlar zorunludur.',
    acknowledge:
      'Bunun bir demo olduğunu ve sipariş ya da ödeme işlenmeyeceğini anlıyorum.',
    submit: 'Demo adımını onayla',
    submitting: 'Demo bilgileri doğrulanıyor…',
    empty: 'Çantanız boş. Devam etmeden önce bir ürün ekleyin.',
    successTitle: 'Demo adımı tamamlandı',
    success:
      'Demo bilgileriniz doğrulandı. Sipariş verilmedi, ödeme alınmadı ve teslimat düzenlenmedi. Çantanız değişmedi. İletişim ve adres bilgileri gönderilmedi veya kaydedilmedi.',
    summary: 'Demo özeti',
    items: 'İncelenen ürün adedi',
    restart: 'Yeni demo başlat',
    back: 'Mağazaya dön',
    errors: {
      name: 'En az iki karakterli bir ad girin.',
      email: 'Geçerli bir e-posta adresi girin.',
      phone: 'En az yedi rakamlı bir telefon girin veya boş bırakın.',
      address: 'En az üç karakterli bir adres girin.',
      required: 'Bu alanı doldurun.',
      country: 'En az iki karakterli bir ülke girin.',
      tooLong: 'Bu değer çok uzun. Lütfen kısaltın.',
      demoRequired: 'Bunun bir demo olduğunu anladığınızı onaylayın.',
      invalid: 'Bu alanı kontrol edip tekrar deneyin.',
    },
  },
}

export function checkoutErrorMessage(
  code: string | undefined,
  language: Language,
): string | undefined {
  if (!code) return undefined
  const errors = checkoutMessages[language].errors
  return (
    Object.entries(errors).find(([key]) => key === code)?.[1] ?? errors.invalid
  )
}
