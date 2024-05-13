import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { webSocket, WebSocketSubject } from 'rxjs/webSocket';
import { CONFIG } from 'src/environments/config';
import { environment } from 'src/environments/environment.development';

const apiURL = environment.apiUrl;
const host = environment.host;
const SOCKET_API = apiURL + 'room/key';

@Injectable({
  providedIn: 'root',
})
export class SocketService {
  private roomKey: string;

  constructor(private http: HttpClient) {}

  /**
   * Fetch the key of a new room from backend for websocket connection
   */
  fetchRoomKey(): Observable<string> {
    return this.http.get(SOCKET_API, { responseType: 'text' });
  }

  /**
   * Open websocket connection and return an Observable of string
   *
   * @returns WebSocketSubject of string or NULL if either the username or the roomKey is null or empty
   */
  openWsConn(username: string, roomKey: string): WebSocketSubject<string> {
    this.roomKey = roomKey;
    let wss: WebSocketSubject<string> = webSocket({
      url: `wss://${host}/ws/chat/room/${roomKey}/name/${username}`,
      deserializer: (msg) => msg.data,
      closeObserver: {
        next(closeEvent) {
          console.log(
            `CloseEvent_ Code: ${closeEvent.code}, Reason: ${closeEvent.reason}`
          );
          if (closeEvent.code == 1006)
            alert('Veuillez actualisez votre navigateur !');
        },
      },
    });
    return wss;
  }
}
