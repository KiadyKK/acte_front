import {
  HttpEvent,
  HttpHandler,
  HttpInterceptor,
  HttpRequest,
  HTTP_INTERCEPTORS,
} from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { StorageService } from '../services/storage/storage.service';

@Injectable()
export class HttpRequestInterceptor implements HttpInterceptor {
  constructor(private storageService: StorageService) {}

  intercept(
    req: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    if (req.headers.get('skip')) {
      return next.handle(req);
    } else {
      req = req.clone({
        withCredentials: true,
        headers: req.headers
          .set('ID', this.storageService.getItem('ID'))
          .set('utilisateur', this.storageService.getItem('utilisateur'))
          .set('user_id', this.storageService.getItem('user_id'))
          .set('trigramme', this.storageService.getItem('trigramme'))
          .set('status', this.storageService.getItem('status'))
          .set('Authorization', this.storageService.getItem('authorization')),
      });

      return next.handle(req);
    }
  }
}

export const httpInterceptorProviders = {
  provide: HTTP_INTERCEPTORS,
  useClass: HttpRequestInterceptor,
  multi: true,
};
