import CryptoJS from 'crypto-js';
import {Md5} from 'ts-md5';

const CryptoSecret = '__CryptoJS_Secret__';

/**
 * 加密数据
 * @param data - 数据
 */
export function encrypto(data: any) {
  const newData = JSON.stringify(data);
  return CryptoJS.AES.encrypt(newData, CryptoSecret).toString();
}

/**
 * 解密数据
 * @param cipherText - 密文
 */
export function decrypto(cipherText: string) {
  const bytes = CryptoJS.AES.decrypt(cipherText, CryptoSecret);
  const originalText = bytes.toString(CryptoJS.enc.Utf8);
  if (originalText) {
    return JSON.parse(originalText);
  }
  return null;
}

/*
 * 密码加密 ===============================================================
 * 默认的 KEY IV     如果在加密解密的时候没有传入KEY和IV,就会使用这里定义的
 *
 * 前后端交互时需要前后端密钥和初始向量保持一致
 * 密码加密 ===============================================================
 */

const key = CryptoJS.enc.Utf8.parse(Md5.hashStr('CBo5ut0qFUVF73VVBjKPWaCkuhq5')); //  密钥        长度必须为16位
const iv = CryptoJS.enc.Utf8.parse('1234567890pwdaes');

/*
 * AES加密 ：字符串 key iv  返回base64
 */
export function Encrypt(str: string) {
  const srcs = CryptoJS.enc.Utf8.parse(str);
  const encrypt = CryptoJS.AES.encrypt(srcs, key, {
    iv,
    mode: CryptoJS.mode.CBC, // 这里可以选择AES加密的模式
    padding: CryptoJS.pad.Pkcs7
  });
  return CryptoJS.enc.Base64.stringify(encrypt.ciphertext);
}

/*
 * AES 解密 ：字符串 key iv  返回base64
 */
export function Decrypt(str: string) {
  const base64 = CryptoJS.enc.Base64.parse(str);
  const src = CryptoJS.enc.Base64.stringify(base64);

  const decrypt = CryptoJS.AES.decrypt(src, key, {
    iv,
    mode: CryptoJS.mode.CBC, // 这里可以选择AES解密的模式
    padding: CryptoJS.pad.Pkcs7
  });

  const decryptedStr = decrypt.toString(CryptoJS.enc.Utf8);
  return decryptedStr.toString();
}
