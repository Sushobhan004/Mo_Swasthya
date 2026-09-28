/**
 * SwasthyaAI Client-Side Health Records Vault
 * AES-GCM 256-bit encryption with PBKDF2 key derivation for local health records.
 */
class CryptoRecordsVault {
  constructor() {
    this.salt = new Uint8Array([12, 54, 89, 120, 45, 99, 18, 33, 76, 210, 45, 11, 87, 65, 34, 90]);
  }

  async deriveKey(passphrase) {
    const enc = new TextEncoder();
    const keyMaterial = await window.crypto.subtle.importKey(
      "raw",
      enc.encode(passphrase),
      { name: "PBKDF2" },
      false,
      ["deriveKey"]
    );
    return window.crypto.subtle.deriveKey(
      {
        name: "PBKDF2",
        salt: this.salt,
        iterations: 100000,
        hash: "SHA-256"
      },
      keyMaterial,
      { name: "AES-GCM", length: 256 },
      false,
      ["encrypt", "decrypt"]
    );
  }

  async encryptRecord(plainDataObj, passphrase = "user_device_local_key_default") {
    const key = await this.deriveKey(passphrase);
    const iv = window.crypto.getRandomValues(new Uint8Array(12));
    const enc = new TextEncoder();
    const encodedData = enc.encode(JSON.stringify(plainDataObj));

    const ciphertext = await window.crypto.subtle.encrypt(
      { name: "AES-GCM", iv: iv },
      key,
      encodedData
    );

    const combined = new Uint8Array(iv.length + ciphertext.byteLength);
    combined.set(iv);
    combined.set(new Uint8Array(ciphertext), iv.length);

    // Convert to base64
    let binary = '';
    for (let i = 0; i < combined.byteLength; i++) {
      binary += String.fromCharCode(combined[i]);
    }
    return btoa(binary);
  }

  async decryptRecord(encryptedBase64, passphrase = "user_device_local_key_default") {
    try {
      const key = await this.deriveKey(passphrase);
      const binary = atob(encryptedBase64);
      const combined = new Uint8Array(binary.length);
      for (let i = 0; i < binary.length; i++) {
        combined[i] = binary.charCodeAt(i);
      }

      const iv = combined.slice(0, 12);
      const ciphertext = combined.slice(12);

      const decrypted = await window.crypto.subtle.decrypt(
        { name: "AES-GCM", iv: iv },
        key,
        ciphertext
      );

      const dec = new TextDecoder();
      return JSON.parse(dec.decode(decrypted));
    } catch (e) {
      console.error("Decryption failed:", e);
      return null;
    }
  }
}

window.cryptoVault = new CryptoRecordsVault();
