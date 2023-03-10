import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

const SOAP_API = 'http://localhost:8080/soap/';

@Injectable({
  providedIn: 'root',
})
export class SoapService {
  constructor(private http: HttpClient) {}

  getReasonsRead(): Observable<any> {
    return this.http.get(SOAP_API + 'reasons-read');
  }

  verifydesactivation(data: any): Observable<any> {
    return this.http.post(SOAP_API + 'verify-desactivation', data);
  }
}
