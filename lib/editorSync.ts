const prefix = "moji-editor-dirty:";

function storage(): Storage | null {
  if (typeof window === "undefined") return null;
  try {
    return window.localStorage;
  } catch {
    return null;
  }
}

export function dirtyKey(eventId: string): string {
  return `${prefix}${eventId}`;
}

export function markEditorDirty(eventId: string) {
  storage()?.setItem(dirtyKey(eventId), new Date().toISOString());
}

export function markEditorClean(eventId: string) {
  storage()?.removeItem(dirtyKey(eventId));
}

export function getEditorDirtyAt(eventId: string): string | null {
  return storage()?.getItem(dirtyKey(eventId)) ?? null;
}

export function isEditorDirty(eventId: string): boolean {
  return Boolean(getEditorDirtyAt(eventId));
}
