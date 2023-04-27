import { Injectable } from '@angular/core';
import * as CryptoJS from 'crypto-js';
@Injectable({
  providedIn: 'root',
})
export class CriptoService {
  private _Mkey = '81bqoIj*SLC^DMjHeQx6rYpy$E$&BAG7cba77Kd$msI^*Qe@pO';

  encriptarAES(value: string): string {
    const baseEn64 = this.Aes_EncryptString_ToBase64String(value);
    return this.ConvertStringToHex(baseEn64);
  }

  decriptarAES(value: string): string {
    const string = this.ConvertHexToString(value);
    return this.Aes_DecryptString_FromBase64String(string);
  }

  encriptarMD5(key: any): string {
    return CryptoJS.MD5(key).toString();
  }

  private Aes_EncryptString_ToBase64String(plainText: string): string {
    if (!plainText) {
      throw new Error('plainText é nulo ou vazio.');
    }
    if (!this._Mkey) {
      throw new Error('Chave é nula ou vazia.');
    }
    const passwordBytes = CryptoJS.enc.Utf8.parse(this._Mkey);
    const aesKey = CryptoJS.SHA256(passwordBytes);
    const aesIV = CryptoJS.MD5(passwordBytes);

    const encrypted = CryptoJS.AES.encrypt(plainText, aesKey, {
      iv: aesIV,
      padding: CryptoJS.pad.Pkcs7,
      mode: CryptoJS.mode.CBC,
    });

    return encrypted.ciphertext.toString(CryptoJS.enc.Base64);
  }

  private Aes_DecryptString_FromBase64String(base64CipherText: string): string {
    if (!base64CipherText) {
      throw new Error('base64CipherText é nulo ou vazio.');
    }
    if (!this._Mkey) {
      throw new Error('Chave é nula ou vazia.');
    }
    const passwordBytes = CryptoJS.enc.Utf8.parse(this._Mkey);
    const aesKey = CryptoJS.SHA256(passwordBytes);
    const aesIV = CryptoJS.MD5(passwordBytes);

    const ciphertext = CryptoJS.enc.Base64.parse(base64CipherText);
    const cipherParams = CryptoJS.lib.CipherParams.create({ ciphertext });

    const decrypted = CryptoJS.AES.decrypt(cipherParams, aesKey, {
      iv: aesIV,
      padding: CryptoJS.pad.Pkcs7,
      mode: CryptoJS.mode.CBC,
    });

    return decrypted.toString(CryptoJS.enc.Utf8);
  }

  private ConvertStringToHex(input: string): string {
    const stringBytes = new TextEncoder().encode(input);
    let sbBytes = '';
    for (const b of stringBytes) {
      sbBytes += b.toString(16).padStart(2, '0');
    }

    return sbBytes;
  }

  private ConvertHexToString(hexInput: string): string {
    let output = '';
    for (let i = 0; i < hexInput.length; i += 2) {
      const hexChar = hexInput.substring(i, i + 2);
      output += String.fromCharCode(parseInt(hexChar, 16));
    }

    return output;
  }
}
