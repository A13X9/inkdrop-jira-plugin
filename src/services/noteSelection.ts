/**
 * Resolve the target note ID from Inkdrop's noteListBar state.
 * Returns the first actionTargetNoteId, or null if none.
 */
export function getTargetNoteId(): string | null {
  const { noteListBar } = inkdrop.store.getState();
  const { actionTargetNoteIds } = noteListBar;

  if (actionTargetNoteIds && actionTargetNoteIds.length > 0) {
    return actionTargetNoteIds[0];
  }
  return null;
}
