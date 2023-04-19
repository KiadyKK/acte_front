import { HttpClient, HttpEvent, HttpRequest } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

const ACTE_API = 'http://localhost:8080/acte-masse/';

@Injectable({
  providedIn: 'root',
})
export class ActeMasseService {
  constructor(private http: HttpClient) {}

  monitoring(data: any): Observable<any> {
    return this.http.post(ACTE_API + `monitoring`, data);
  }

  saveDesactivation(data: FormData): Observable<any> {
    return this.http.post(ACTE_API + 'desactivation', data, {
      responseType: 'text',
    });
  }

  saveActivation(data: FormData): Observable<any> {
    return this.http.post(ACTE_API + 'activation', data, {
      responseType: 'text',
    });
  }
}
