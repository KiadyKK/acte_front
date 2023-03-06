import { Injectable } from '@angular/core';
import * as CryptoJS from 'crypto-js';

const USER_KEY = 'auth-user';

@Injectable({
  providedIn: 'root',
})
export class StorageService {
  constructor() {}

  clean(): void {
    window.sessionStorage.clear();
  }

  public saveUser(data: any): void {
    this.clean();
    
    window.sessionStorage.setItem("ID", CryptoJS.AES.encrypt(data.ID, "MYKEY4DEMO").toString());
    window.sessionStorage.setItem("utilisateur", CryptoJS.AES.encrypt(data.utilisateur, "MYKEY4DEMO").toString());
    window.sessionStorage.setItem("user_id", CryptoJS.AES.encrypt(data.user_id.toString(), "MYKEY4DEMO").toString());
    window.sessionStorage.setItem("trigramme", CryptoJS.AES.encrypt(data.trigramme, "MYKEY4DEMO").toString());
    window.sessionStorage.setItem("password", CryptoJS.AES.encrypt(data.password, "MYKEY4DEMO").toString());
    window.sessionStorage.setItem("status", CryptoJS.AES.encrypt(data.status.toString(), "MYKEY4DEMO").toString());
    window.sessionStorage.setItem("token", CryptoJS.AES.encrypt(data.token, "MYKEY4DEMO").toString());
  }

  public getUser(): any {
    const user = window.sessionStorage.getItem(USER_KEY);
    if (user) {
      return JSON.parse(user);
    }

    return null;
  }

  public isLoggedIn(): boolean {
    const user = window.sessionStorage.getItem(USER_KEY);
    if (user) {
      return true;
    }

    return false;
  }
}
