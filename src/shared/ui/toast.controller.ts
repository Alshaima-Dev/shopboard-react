import type { MessageKey } from '../../features/i18n/i18n.ts'

export const TOAST_DURATION_MS = 2600

export function createToastController(
  publish: (notice: MessageKey | null) => void,
) {
  let timer: ReturnType<typeof setTimeout> | undefined
  return {
    notify(key: MessageKey) {
      clearTimeout(timer)
      publish(key)
      timer = setTimeout(() => publish(null), TOAST_DURATION_MS)
    },
    dispose() {
      clearTimeout(timer)
    },
  }
}
