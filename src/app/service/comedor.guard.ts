import { CanActivateFn } from '@angular/router';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { CookieService } from 'ngx-cookie-service';
import { retry } from 'rxjs';

export const comedorGuard: CanActivateFn = (route, state) => {
  const cookieService = inject(CookieService)
  const router = inject(Router)
  const comedor = cookieService.get('area')

  if(comedor ==='comedor_2' || comedor === 'comedor_1'){
    return true
  }
  router.navigate(['/'])
  return true;
}

