import CryptoJS, {AES} from 'crypto-js';

export const useEncryptionService = () => {
    const encryptData = (data: any, secretKey: string): string => {
        return AES.encrypt(JSON.stringify(data), secretKey).toString();
    };

    const decryptData = (encryptedData: string, secretKey: string) => {
        const decryptedData = AES.decrypt(encryptedData, secretKey).toString(CryptoJS.enc.Utf8);
        return JSON.parse(decryptedData);
    };

    return {encryptData, decryptData}
}