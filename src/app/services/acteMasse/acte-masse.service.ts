import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

const ACTE_API = 'http://localhost:8080/acte-masse/';

@Injectable({
  providedIn: 'root',
})
export class ActeMasseService {
  constructor(private http: HttpClient) {}

  saveDesactivation(data: any): Observable<any> {
    return this.http.post(ACTE_API + 'desactivation', data, {
      responseType: 'text',
    });
  }

  monitoring(
    id_role: number,
    user_id: number,
    pageNumber: number
  ): Observable<any> {
    return this.http.get(
      ACTE_API +
        `monitoring?id_role=${id_role}&user_id=${user_id}&pageNumber=${pageNumber}`
    );
  }
}
