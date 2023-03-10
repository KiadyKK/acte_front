import {
  HttpEvent,
  HttpHandler,
  HttpInterceptor,
  HttpRequest,
  HTTP_INTERCEPTORS
} from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { finalize } from 'rxjs/operators';

import { SpinnerService } from '../services/spinner/spinner.service';

@Injectable()
export class SpinnerInterceptor implements HttpInterceptor {
  constructor(public spinnerService: SpinnerService) {}

  intercept(
    request: HttpRequest<unknown>,
    next: HttpHandler
  ): Observable<HttpEvent<unknown>> {
    this.spinnerService.handleRequest('plus');
    return next.handle(request).pipe(finalize(this.finalize.bind(this)));
  }

  finalize = (): void => this.spinnerService.handleRequest();
}

export const spinnerInterceptorProviders = {
  provide: HTTP_INTERCEPTORS,
  useClass: SpinnerInterceptor,
  multi: true,
};