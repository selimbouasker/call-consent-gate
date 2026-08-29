export function matchConsentPhrase(reply: string): 'yes' | 'no' | null {
  const normalized = reply.trim().toLowerCase();
  if (/\byes,?\s+i\s+consent\b/.test(normalized)) {
    return 'yes';
  }
  if (/\bno,?\s+i\s+don'?t\s+consent\b/.test(normalized)) {
    return 'no';
  }
  return null;
}
