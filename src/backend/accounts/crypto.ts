import { pbkdf2Async } from "@noble/hashes/pbkdf2";
import { sha256 } from "@noble/hashes/sha256";
import { generateMnemonic, validateMnemonic } from "@scure/bip39";
import { wordlist } from "@scure/bip39/wordlists/english";
import * as forge from "node-forge";

type Keys = {
  privateKey: Uint8Array;
  publicKey: Uint8Array;
  seed: Uint8Array;
};

async function seedFromMnemonic(mnemonic: string) {
  return pbkdf2Async(sha256, mnemonic, "mnemonic", {
    c: 2048,
    dkLen: 32,
  });
}

export function verifyValidMnemonic(mnemonic: string) {
  return validateMnemonic(mnemonic, wordlist);
}

export async function keysFromMnemonic(mnemonic: string): Promise<Keys> {
  const seed = await seedFromMnemonic(mnemonic);

  const { privateKey, publicKey } = forge.pki.ed25519.generateKeyPair({
    seed,
  });

  return {
    privateKey,
    publicKey,
    seed,
  };
}

export function genMnemonic(): string {
  return generateMnemonic(wordlist);
}

export async function signCode(
  code: string,
  privateKey: Uint8Array,
): Promise<Uint8Array> {
  return forge.pki.ed25519.sign({
    encoding: "utf8",
    message: code,
    privateKey,
  });
}

export function bytesToBase64(bytes: Uint8Array) {
  return forge.util.encode64(String.fromCodePoint(...bytes));
}

export function bytesToBase64Url(bytes: Uint8Array): string {
  return bytesToBase64(bytes)
    .replace(/\//g, "_")
    .replace(/\+/g, "-")
    .replace(/=+$/, "");
}

export async function signChallenge(keys: Keys, challengeCode: string) {
  const signature = await signCode(challengeCode, keys.privateKey);
  return bytesToBase64Url(signature);
}

export interface EncryptedData {
  data: string;
  iv: string;
  tag: string;
}

function bufferToBase64(buffer: Uint8Array | Buffer): string {
  if (buffer instanceof Buffer) {
    return buffer.toString("base64");
  }
  return Buffer.from(buffer).toString("base64");
}

export function base64ToBuffer(data: string): Uint8Array {
  return Buffer.from(data, "base64");
}

export function base64ToStringBuffer(data: string) {
  const buffer = base64ToBuffer(data);
  return forge.util.createBuffer(Buffer.from(buffer).toString("binary"));
}

export function stringBufferToBase64(buffer: forge.util.ByteStringBuffer) {
  return bufferToBase64(Buffer.from(buffer.getBytes(), "binary"));
}

export async function encryptData(
  data: string,
  secret: Uint8Array | string,
): Promise<string> {
  const secretBuffer =
    typeof secret === "string" ? base64ToBuffer(secret) : secret;
  const iv = forge.random.getBytesSync(12);
  const cipher = forge.cipher.createCipher(
    "AES-GCM",
    forge.util.createBuffer(Buffer.from(secretBuffer).toString("binary")),
  );
  cipher.start({
    iv,
    tagLength: 128,
  });
  cipher.update(forge.util.createBuffer(data));
  cipher.finish();

  const encryptedData = {
    data: stringBufferToBase64(cipher.output),
    iv: bufferToBase64(Buffer.from(iv, "binary")),
    tag: stringBufferToBase64(cipher.mode.tag),
  };

  return JSON.stringify(encryptedData);
}

export function decryptData(
  encryptedData: EncryptedData | string,
  secret: Uint8Array | string,
): string {
  const secretBuffer =
    typeof secret === "string" ? base64ToBuffer(secret) : secret;

  // If encryptedData is a string, parse it as JSON
  const data: EncryptedData =
    typeof encryptedData === "string"
      ? JSON.parse(encryptedData)
      : encryptedData;

  const decipher = forge.cipher.createDecipher(
    "AES-GCM",
    forge.util.createBuffer(Buffer.from(secretBuffer).toString("binary")),
  );
  decipher.start({
    iv: base64ToStringBuffer(data.iv),
    tagLength: 128,
    tag: base64ToStringBuffer(data.tag),
  });
  decipher.update(base64ToStringBuffer(data.data));
  if (!decipher.finish()) throw new Error("failed to decrypt");
  return decipher.output.toString();
}
