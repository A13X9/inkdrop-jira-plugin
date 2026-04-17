/**
 * Load a note from Inkdrop's local database by ID.
 */
export async function loadNoteBody(noteId: string): Promise<string> {
  const db = inkdrop.main.dataStore.getLocalDB();
  const note = await db.notes.get(noteId);
  return note.body || "";
}
