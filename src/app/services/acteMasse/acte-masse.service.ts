import { HttpClient, HttpEvent, HttpRequest } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment.development';

const apiURL = environment.apiUrl;
const ACTE_API = apiURL + 'acte-masse/';

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

  saveModifyFields(data: FormData): Observable<any> {
    return this.http.post(ACTE_API + 'modify-fields', data, {
      responseType: 'text',
    });
  }

  saveTakeOver(data: FormData): Observable<any> {
    return this.http.post(ACTE_API + 'take-over', data, {
      responseType: 'text',
    });
  }

  getReasonsRead(rsState: string): Observable<any> {
    return this.http.get(ACTE_API + `reasons-read?rsState=${rsState}`);
  }

  getRateplansRead(): Observable<any> {
    return this.http.get(ACTE_API + 'rateplans-read');
  }

  getServiceRateplans(rpcode: number, rpVscode: number): Observable<any> {
    return this.http.get(
      ACTE_API + `service-rateplans?rpcode=${rpcode}&rpVscode=${rpVscode}`
    );
  }

  getParametersRead(sncode: number, sccode: number): Observable<any> {
    return this.http.get(
      ACTE_API + `parameters-read?sncode=${sncode}&sccode=${sccode}`
    );
  }

  getClient(custcode: string): Observable<any> {
    return this.http.get(ACTE_API + `custcode?custcode=${custcode}`);
  }

  verifydesactivation(data: any): Observable<any> {
    return this.http.post(ACTE_API + 'verify-desactivation', data);
  }

  verifyActivation(data: any): Observable<any> {
    return this.http.post(ACTE_API + 'verify-activation', data);
  }

  verifyModifyFields(data: any): Observable<any> {
    return this.http.post(ACTE_API + 'verify-modify-fields', data);
  }

  verifyTakeOver(data: any): Observable<any> {
    return this.http.post(ACTE_API + 'verify-take-over', data);
  }
}
