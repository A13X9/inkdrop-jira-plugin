// Type declarations for Inkdrop plugin environment

declare namespace inkdrop {
  const commands: {
    add(
      target: HTMLElement,
      commands: Record<string, (event?: Event) => void>,
    ): { dispose(): void };
  };

  const notifications: {
    addInfo(message: string, options?: { dismissable?: boolean }): void;
    addWarning(message: string, options?: { dismissable?: boolean }): void;
    addError(message: string, options?: { dismissable?: boolean }): void;
  };

  const store: {
    getState(): {
      noteListBar: {
        actionTargetNoteIds: string[];
        selectedNoteIds: string[];
      };
    };
  };

  const main: {
    dataStore: {
      getLocalDB(): InkdropLocalDB;
    };
  };
}

interface InkdropLocalDB {
  notes: {
    get(noteId: string): Promise<InkdropNote>;
  };
}

interface InkdropNote {
  _id: string;
  title: string;
  body: string;
  bookId: string;
  tags: string[];
  createdAt: number;
  updatedAt: number;
}
