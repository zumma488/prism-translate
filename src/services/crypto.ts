/**
 * Crypto Service - AES-GCM encryption/decryption for sensitive settings
 *
 * Storage format: PRISM_ENC_V1:<base64(salt[16] + iv[12] + ciphertext)>
 * Key derivation: PBKDF2 (SHA-256, 100k iterations) from app identifier + salt
 * 
 * Updated to use crypto-js for cross-environment compatibility (HTTP/HTTPS)
 */

import CryptoJS from 'crypto-js';

const MAGIC_PREFIX = 'PRISM_ENC_V1:';
const APP_KEY_MATERIAL = 'prism-translate-v0.1.1-key';
const SALT_LENGTH = 16;
// CryptoJS AES uses block size of 128 bits (16 bytes) for IV
const IV_LENGTH = 16; 
const PBKDF2_ITERATIONS = 100_000;
const KEY_SIZE = 256 / 32; // 256 bits = 8 words

/**
 * Derive an AES-256 key from the app identifier and a salt using PBKDF2
 */
function deriveKey(salt: CryptoJS.lib.WordArray): CryptoJS.lib.WordArray {
  return CryptoJS.PBKDF2(APP_KEY_MATERIAL, salt, {
    keySize: KEY_SIZE,
    iterations: PBKDF2_ITERATIONS,
    hasher: CryptoJS.algo.SHA256
  });
}

/**
 * Convert Uint8Array to WordArray
 */
function uint8ToWordArray(u8arr: Uint8Array): CryptoJS.lib.WordArray {
  const len = u8arr.length;
  const words = [];
  for (let i = 0; i < len; i++) {
    words[i >>> 2] |= (u8arr[i] & 0xff) << (24 - (i % 4) * 8);
  }
  return CryptoJS.lib.WordArray.create(words, len);
}

/**
 * Convert WordArray to Uint8Array
 */
function wordArrayToUint8(wordArray: CryptoJS.lib.WordArray): Uint8Array {
  const words = wordArray.words;
  const sigBytes = wordArray.sigBytes;
  const u8 = new Uint8Array(sigBytes);
  for (let i = 0; i < sigBytes; i++) {
    u8[i] = (words[i >>> 2] >>> (24 - (i % 4) * 8)) & 0xff;
  }
  return u8;
}

/**
 * Check if a string is encrypted with our format
 */
export function isEncrypted(data: string): boolean {
  return data.startsWith(MAGIC_PREFIX);
}

/**
 * Encrypt a plain text string using AES-256 (CBC/GCM depending on implementation)
 * crypto-js default is AES-CBC with PKCS7 padding.
 * @returns Encrypted string in format: PRISM_ENC_V1:<base64(salt + iv + ciphertext)>
 */
export async function encrypt(plaintext: string): Promise<string> {
  // Generate random salt and IV
  const salt = CryptoJS.lib.WordArray.random(SALT_LENGTH);
  const iv = CryptoJS.lib.WordArray.random(IV_LENGTH);
  
  // Derive key
  const key = deriveKey(salt);

  // Encrypt
  const encrypted = CryptoJS.AES.encrypt(plaintext, key, {
    iv: iv,
    mode: CryptoJS.mode.CBC,
    padding: CryptoJS.pad.Pkcs7
  });

  // Combine: salt + iv + ciphertext
  // crypto-js encrypted object has .ciphertext property as WordArray
  const combined = salt
    .concat(iv)
    .concat(encrypted.ciphertext);

  // Convert to Base64
  const base64 = CryptoJS.enc.Base64.stringify(combined);

  return MAGIC_PREFIX + base64;
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
  
  // Decode Base64 to WordArray
  const combined = CryptoJS.enc.Base64.parse(base64Data);

  // Extract parts
  // Basic validation: must maintain at least salt + iv
  if (combined.sigBytes < SALT_LENGTH + IV_LENGTH) {
    throw new Error('Encrypted data is too short');
  }

  // Extract parts
  // WordArray.clone() is important because shifting modifies in place
  const salt = CryptoJS.lib.WordArray.create(combined.words.slice(0, SALT_LENGTH / 4), SALT_LENGTH);
  
  // IV starts after SALT
  // Calculate offset in words (4 bytes per word)
  const ivStartWord = SALT_LENGTH / 4;
  const ivEndWord = ivStartWord + (IV_LENGTH / 4);
  const iv = CryptoJS.lib.WordArray.create(combined.words.slice(ivStartWord, ivEndWord), IV_LENGTH);
  
  // Ciphertext is the rest
  const cipherStartWord = ivEndWord;
  const ciphertext = CryptoJS.lib.WordArray.create(
    combined.words.slice(cipherStartWord),
    combined.sigBytes - SALT_LENGTH - IV_LENGTH
  );

  // Derive key
  const key = deriveKey(salt);

  // Decrypt
  const decrypted = CryptoJS.AES.decrypt(
    { ciphertext: ciphertext } as CryptoJS.lib.CipherParams,
    key,
    {
      iv: iv,
      mode: CryptoJS.mode.CBC,
      padding: CryptoJS.pad.Pkcs7
    }
  );

  // Convert to UTF8 string
  try {
    const result = decrypted.toString(CryptoJS.enc.Utf8);
    if (!result) throw new Error('Decryption resulted in empty string (wrong key or corrupted data)');
    return result;
  } catch (e) {
    // Re-throw with context
    throw new Error(`Failed to decrypt data: ${e instanceof Error ? e.message : String(e)}`);
  }
}
