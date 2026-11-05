import { useEffect, useState } from 'react'
import type { MessageKey } from '../../features/i18n/i18n.ts'
import { createToastController } from './toast.controller.ts'

export function useToast() {
  const [notice, setNotice] = useState<MessageKey | null>(null)
  const [controller] = useState(() => createToastController(setNotice))
  useEffect(() => () => controller.dispose(), [controller])
  return { notice, notify: controller.notify }
}
