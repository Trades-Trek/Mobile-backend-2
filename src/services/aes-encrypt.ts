const CryptoJS = require("crypto-js");
const crypto = require("crypto");
export const useEncryptionService = () => {
    let iv = 'c8df32e53d16c468f509b12f40be6ddb5a845b6551d0f763c23ca9c44f1ffd6f';

    const encryptData = (data: any, secretKey: string, iv?:any): string => {
        // console.log(iv)
        // iv = CryptoJS.enc.Base64.parse(iv);
        // console.log(iv.toString())
        return CryptoJS.AES.encrypt(JSON.stringify(data), secretKey).toString();
    };

    const decryptData = (encryptedData: string, secretKey: string) => {
        const decryptedData = CryptoJS.AES.decrypt(encryptedData, secretKey, {iv:process.env.ENCRYPTION_IV}).toString(CryptoJS.enc.Utf8);
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