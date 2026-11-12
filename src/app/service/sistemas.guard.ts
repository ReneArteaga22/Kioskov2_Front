import { CanActivateFn, Router } from '@angular/router';
import { inject } from '@angular/core';
import { CookieService } from 'ngx-cookie-service';

/** Solo usuarios con sesión y área "sistemas". */
export const sistemasGuard: CanActivateFn = () => {
  const cookie = inject(CookieService);
  const router = inject(Router);
  if (cookie.check('sesion') && cookie.get('area') === 'sistemas') return true;
  router.navigate(['/']);
  return false;
};