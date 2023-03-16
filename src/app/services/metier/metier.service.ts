import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs'

const METIER_API = 'http://localhost:8080/validation-metier/';

@Injectable({
  providedIn: 'root'
})
export class MetierService {
  constructor(private http: HttpClient) {}

  afficherInteraction(idActe: number): Observable<any> {
    return this.http.get(METIER_API + `afficher-interaction?idActe=${idActe}`)
  }

  rejeter(data: any): Observable<any> {
    return this.http.post(METIER_API + 'rejeter', data)
  }
}
