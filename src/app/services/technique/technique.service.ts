import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

const TECHNIQUE_API = 'http://localhost:8080/validation-technique/';


@Injectable({
  providedIn: 'root',
})
export class TechniqueService {
  constructor(private http: HttpClient) {}

  rejeter(data: any): Observable<any> {
    return this.http.post(TECHNIQUE_API + 'rejeter', data);
  }
}
