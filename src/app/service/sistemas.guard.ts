import { CanActivateFn } from '@angular/router';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { CookieService } from 'ngx-cookie-service';

export const sistemasGuard: CanActivateFn = (route, state) => {
  const cookieService = inject(CookieService)
  const router = inject(Router)
  const token = cookieService.get('sesion')
  const area = cookieService.get('area')

  if (token && area === 'sistemas') {
    return true
  } 
  router.navigate(['/'])
  return false
}
