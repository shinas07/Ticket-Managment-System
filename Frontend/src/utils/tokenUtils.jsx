import CryptoJS from 'crypto-js';

const SECRET_KEY = import.meta.env.VITE_ENCRYPTION_KEY || 'your-fallback-secret-key';

export const encryptToken = (token) => {
    return CryptoJS.AES.encrypt(token, SECRET_KEY).toString();
};

export const decryptToken = (encryptedToken) => {
    const bytes = CryptoJS.AES.decrypt(encryptedToken, SECRET_KEY);
    return bytes.toString(CryptoJS.enc.Utf8);
}; 