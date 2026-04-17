import { getTargetNoteId } from "../services/noteSelection";
import { loadNoteBody } from "../services/noteLoader";
import { copyToClipboard } from "../services/clipboard";
import { showSuccess, showError } from "../services/notifications";
import { toJira } from "../transformers/jira";

export async function copyAsJira(): Promise<void> {
  const noteId = getTargetNoteId();
  if (!noteId) {
    showError("No note selected.");
    return;
  }

  try {
    const body = await loadNoteBody(noteId);
    if (!body) {
      showError("This note has no body content to copy.");
      return;
    }
    const transformed = toJira(body);
    copyToClipboard(transformed);
    showSuccess("Copied body as Jira");
  } catch (err) {
    showError("Failed to copy note: " + (err as Error).message);
  }
}
