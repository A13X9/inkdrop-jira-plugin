/**
 * Show feedback toasts to the user.
 */
export function showSuccess(message: string): void {
  inkdrop.notifications.addInfo(message, { dismissable: true });
}

export function showError(message: string): void {
  inkdrop.notifications.addError(message, { dismissable: true });
}
