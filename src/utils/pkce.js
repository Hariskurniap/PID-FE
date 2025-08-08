function base64URLEncode(buffer) {
  return btoa(String.fromCharCode(...new Uint8Array(buffer)))
    .replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
}

async function sha256(plainText) {
  const encoder = new TextEncoder();
  const data = encoder.encode(plainText);
  return crypto.subtle.digest('SHA-256', data);
}

export async function generatePKCECodes() {
  const array = new Uint8Array(32);
  crypto.getRandomValues(array);
  const codeVerifier = Array.from(array, b => ('0' + b.toString(16)).slice(-2)).join('');
  const hashed = await sha256(codeVerifier);
  const codeChallenge = base64URLEncode(hashed);

  return { codeVerifier, codeChallenge };
}
