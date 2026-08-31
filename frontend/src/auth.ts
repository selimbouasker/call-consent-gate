const PASSWORD_KEY = 'consentGateAppPassword';

export function getStoredPassword(): string | null {
  return sessionStorage.getItem(PASSWORD_KEY);
}

export function storePassword(password: string): void {
  sessionStorage.setItem(PASSWORD_KEY, password);
}

export function clearStoredPassword(): void {
  sessionStorage.removeItem(PASSWORD_KEY);
}

export async function verifyPassword(password: string): Promise<boolean> {
  const res = await fetch('/api/auth/verify', {
    headers: { Authorization: password },
  });
  return res.ok;
}

export async function apiFetch(url: string, options: RequestInit = {}): Promise<Response> {
  const password = getStoredPassword();
  const res = await fetch(url, {
    ...options,
    headers: {
      ...options.headers,
      ...(password ? { Authorization: password } : {}),
    },
  });
  if (res.status === 401) {
    // Stored password is missing or stale — force the lock screen back up.
    clearStoredPassword();
    window.location.reload();
  }
  return res;
}
