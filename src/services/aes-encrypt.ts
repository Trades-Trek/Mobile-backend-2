import CryptoJS, {AES} from 'crypto-js';
import crypto from "crypto";

export const useEncryptionService = () => {
    const encryptData = (data: any, secretKey: string): string => {
        return AES.encrypt(JSON.stringify(data), secretKey).toString();
    };

    const decryptData = (encryptedData: string, secretKey: string) => {
        const decryptedData = AES.decrypt(encryptedData, secretKey).toString(CryptoJS.enc.Utf8);
        return JSON.parse(decryptedData);
    };

    return {encryptData, decryptData}

    const generateSecretKey = (): string => {
        const keyLength = 32; // 32 bytes = 256 bits (AES-256)
        const buffer = new Uint8Array(keyLength);
        crypto.getRandomValues(buffer);
        return Array.from(buffer, (byte) =>
            byte.toString(16).padStart(2, '0')
        ).join('');
    };
}