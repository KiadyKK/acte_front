import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment.development';

const apiURL = environment.apiUrl;
const TECHNIQUE_API = apiURL + 'validation-technique/';

@Injectable({
  providedIn: 'root',
})
export class TechniqueService {
  constructor(private http: HttpClient) {}

  rejeter(data: any): Observable<any> {
    return this.http.post(TECHNIQUE_API + 'rejeter', data);
  }
}
