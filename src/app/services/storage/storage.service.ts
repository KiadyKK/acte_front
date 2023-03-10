import { Injectable } from '@angular/core';
import { AES, enc }from 'crypto-js';

@Injectable({
  providedIn: 'root',
})
export class StorageService {
  constructor() {}

  clean(): void {
    sessionStorage.clear();
  }

  public saveUser(data: any): void {
    this.clean();
    
    sessionStorage.setItem("ID", AES.encrypt(data.ID, "MYKEY4DEMO").toString());
    sessionStorage.setItem("utilisateur", AES.encrypt(data.utilisateur, "MYKEY4DEMO").toString());
    sessionStorage.setItem("user_id", AES.encrypt(data.user_id.toString(), "MYKEY4DEMO").toString());
    sessionStorage.setItem("trigramme", AES.encrypt(data.trigramme, "MYKEY4DEMO").toString());
    sessionStorage.setItem("password", AES.encrypt(data.password, "MYKEY4DEMO").toString());
    sessionStorage.setItem("status", AES.encrypt(data.status.toString(), "MYKEY4DEMO").toString());
    sessionStorage.setItem("authorization", AES.encrypt(data.token, "MYKEY4DEMO").toString());
  }

  public getItem(key: string): any {
    const item = sessionStorage.getItem(key) ? sessionStorage.getItem(key) : false;
    if (item) {
      const decrypted = AES.decrypt(item, 'MYKEY4DEMO');
      const decryptedString = decrypted.toString(enc.Utf8);
      return decryptedString;
    }

    return null;
  }
}
