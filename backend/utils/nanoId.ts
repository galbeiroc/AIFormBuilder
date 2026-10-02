import { randomBytes } from "crypto";

const ALPHABET = "0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIKLMNOPQRSTVXYZ";

export const nanoId = (size = 12) => {
  const bytes = randomBytes(size);
  let id: string = "";

  for (let i = 0; i < size; i++) {
    id += ALPHABET[bytes[i] % ALPHABET.length];
  }

  return id;
};
