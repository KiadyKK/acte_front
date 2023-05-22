import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment.development';

const apiURL = environment.apiUrl;
const AUTH_API = apiURL + 'auth/';

const httpOptions = {
  headers: new HttpHeaders({
    'Content-Type': 'application/json',
    skip: 'true',
  }),
};

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  constructor(private http: HttpClient) {}

  login(data: any): Observable<any> {
    return this.http.post(AUTH_API + 'signin', data, httpOptions);
  }
}
