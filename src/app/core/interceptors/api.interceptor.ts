import { HttpInterceptorFn } from '@angular/common/http';
import { environment } from '../../../environments/environment';

export const apiInterceptor: HttpInterceptorFn = (req, next) => {
  // Only intercept TMDb API requests
  if (req.url.startsWith(environment.tmdbApiUrl)) {
    const authReq = req.clone({
      setHeaders: {
        Authorization: `Bearer ${environment.tmdbReadAccessToken}`,
        Accept: 'application/json'
      }
    });
    return next(authReq);
  }
  return next(req);
};
