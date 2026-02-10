/**
 * Crypto Service - AES-GCM encryption/decryption for sensitive settings
 *
 * Storage format: PRISM_ENC_V1:<base64(salt[16] + iv[12] + ciphertext)>
 * Key derivation: PBKDF2 (SHA-256, 100k iterations) from app identifier + salt
 */

const MAGIC_PREFIX = 'PRISM_ENC_V1:';
const APP_KEY_MATERIAL = 'prism-translate-v0.1.1-key';
const SALT_LENGTH = 16;
const IV_LENGTH = 12;
const PBKDF2_ITERATIONS = 100_000;

/**
 * Derive an AES-256-GCM key from the app identifier and a salt using PBKDF2
 */
async function deriveKey(salt: Uint8Array): Promise<CryptoKey> {
  const encoder = new TextEncoder();
  const rawKey = encoder.encode(APP_KEY_MATERIAL);
  const keyMaterial = await crypto.subtle.importKey(
    'raw',
    rawKey.buffer as ArrayBuffer,
    'PBKDF2',
    false,
    ['deriveKey']
  );

  return crypto.subtle.deriveKey(
    {
      name: 'PBKDF2',
      salt: salt.buffer as ArrayBuffer,
      iterations: PBKDF2_ITERATIONS,
      hash: 'SHA-256',
    },
    keyMaterial,
    { name: 'AES-GCM', length: 256 },
    false,
    ['encrypt', 'decrypt']
  );
}

/**
 * Convert Uint8Array to Base64 string
 */
function toBase64(data: Uint8Array): string {
  let binary = '';
  for (let i = 0; i < data.length; i++) {
    binary += String.fromCharCode(data[i]);
  }
  return btoa(binary);
}

/**
 * Convert Base64 string to Uint8Array
 */
function fromBase64(base64: string): Uint8Array {
  const binary = atob(base64);
  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i++) {
    bytes[i] = binary.charCodeAt(i);
  }
  return bytes;
}

/**
 * Check if a string is encrypted with our format
 */
export function isEncrypted(data: string): boolean {
  return data.startsWith(MAGIC_PREFIX);
}

/**
 * Encrypt a plain text string using AES-256-GCM
 * @returns Encrypted string in format: PRISM_ENC_V1:<base64(salt + iv + ciphertext)>
 */
export async function encrypt(plaintext: string): Promise<string> {
  const encoder = new TextEncoder();
  const salt = crypto.getRandomValues(new Uint8Array(SALT_LENGTH));
  const iv = crypto.getRandomValues(new Uint8Array(IV_LENGTH));
  const key = await deriveKey(salt);

  const ciphertext = await crypto.subtle.encrypt(
    { name: 'AES-GCM', iv },
    key,
    encoder.encode(plaintext)
  );

  // Combine: salt + iv + ciphertext
  const combined = new Uint8Array(SALT_LENGTH + IV_LENGTH + ciphertext.byteLength);
  combined.set(salt, 0);
  combined.set(iv, SALT_LENGTH);
  combined.set(new Uint8Array(ciphertext), SALT_LENGTH + IV_LENGTH);

  return MAGIC_PREFIX + toBase64(combined);
}

/**
 * Decrypt a string that was encrypted with encrypt()
 * @throws Error if decryption fails
 */
export async function decrypt(encryptedString: string): Promise<string> {
  if (!isEncrypted(encryptedString)) {
    throw new Error('Data is not in encrypted format');
  }

  const base64Data = encryptedString.slice(MAGIC_PREFIX.length);
  const combined = fromBase64(base64Data);

  const salt = combined.slice(0, SALT_LENGTH);
  const iv = combined.slice(SALT_LENGTH, SALT_LENGTH + IV_LENGTH);
  const ciphertext = combined.slice(SALT_LENGTH + IV_LENGTH);

  const key = await deriveKey(salt);

  const decrypted = await crypto.subtle.decrypt(
    { name: 'AES-GCM', iv },
    key,
    ciphertext
  );

  return new TextDecoder().decode(decrypted);
}
