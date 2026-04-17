/**
 * Write text to the system clipboard via Electron.
 */
export function copyToClipboard(text: string): void {
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  const { clipboard } = require("electron");
  clipboard.writeText(text);
}
