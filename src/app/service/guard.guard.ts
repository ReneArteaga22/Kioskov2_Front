import { CanActivateFn } from '@angular/router';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { CookieService } from 'ngx-cookie-service';

export const guardGuard: CanActivateFn = (route, state) => {
  const cookieService = inject(CookieService)
  const router = inject(Router)
  const token = cookieService.get('sesion')

  if(token){
    router.navigate(['/'])
  }
  return true
}
