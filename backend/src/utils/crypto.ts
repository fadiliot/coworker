import crypto from 'crypto-js';

const ENCRYPTION_KEY = process.env.ENCRYPTION_KEY || 'super-secret-32-character-key-here!';

export const encrypt = (text: string): string => {
  return crypto.AES.encrypt(text, ENCRYPTION_KEY).toString();
};

export const decrypt = (ciphertext: string): string => {
  const bytes = crypto.AES.decrypt(ciphertext, ENCRYPTION_KEY);
  return bytes.toString(crypto.enc.Utf8);
};
