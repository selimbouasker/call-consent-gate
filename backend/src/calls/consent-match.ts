export function matchConsentPhrase(reply: string): 'yes' | 'no' | null {
  const normalized = reply.trim().toLowerCase();
  if (/^yes,?\s+i\s+consent\.?$/.test(normalized)) {
    return 'yes';
  }
  if (/^no,?\s+i\s+don'?t\s+consent\.?$/.test(normalized)) {
    return 'no';
  }
  return null;
}
