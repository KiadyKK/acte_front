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

  valider(data: any): Observable<any> {
    return this.http.post(METIER_API + 'valider', data)
  }

  validerJoker(data: any): Observable<any> {
    return this.http.post(METIER_API + 'valider-joker', data)
  }

  afficherLog(idActe: number): Observable<any> {
    return this.http.get(METIER_API + `afficher-log?idActe=${idActe}`)
  }

  afficherRetourCX(idActe: number): Observable<any> {
    return this.http.get(METIER_API + `afficher-retour-cx?idActe=${idActe}`)
  }
}
