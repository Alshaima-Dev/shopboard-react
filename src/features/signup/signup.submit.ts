export interface SignupSubmission {
  preventDefault: () => void
  currentTarget: Pick<HTMLFormElement, 'reportValidity' | 'reset'>
}

export function submitSignupDemo(event: SignupSubmission, onSuccess: () => void): void {
  event.preventDefault()
  if (!event.currentTarget.reportValidity()) return
  event.currentTarget.reset()
  onSuccess()
}
