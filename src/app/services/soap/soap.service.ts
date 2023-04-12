import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

const SOAP_API = 'http://localhost:8080/soap/';

@Injectable({
  providedIn: 'root',
})
export class SoapService {
  constructor(private http: HttpClient) {}

  getReasonsRead(rsState: string): Observable<any> {
    return this.http.get(SOAP_API + `reasons-read?rsState=${rsState}`);
  }

  verifydesactivation(data: any): Observable<any> {
    return this.http.post(SOAP_API + 'verify-desactivation', data);
  }

  getRateplansRead(): Observable<any> {
    return this.http.get(SOAP_API + 'rateplans-read')
  }

  getServiceRateplans(rpcode: number, rpVscode: number): Observable<any> {
    return this.http.get(SOAP_API + `service-rateplans?rpcode=${rpcode}&rpVscode=${rpVscode}`)
  }

  getParametersRead(sncode: number, sccode: number): Observable<any> {
    return this.http.get(SOAP_API + `parameters-read?sncode=${sncode}&sccode=${sccode}`)
  }

  getClient(custcode: string): Observable<any> {
    return this.http.get(SOAP_API + `custcode?custcode=${custcode}`)
  }

  verifyActivation(data: any): Observable<any> {
    return this.http.post(SOAP_API + 'verify-activation', data);
  }
}
