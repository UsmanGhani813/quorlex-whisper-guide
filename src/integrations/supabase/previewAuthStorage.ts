/**
 * No-op auth-storage broker.
 * The previous version brokered Supabase auth to an editor iframe.
 * The app now uses default browser localStorage (Supabase's default),
 * so this stub returns `undefined` and Supabase falls back to it.
 */
export function brokeredPreviewStorage(): undefined {
  return undefined;
}
