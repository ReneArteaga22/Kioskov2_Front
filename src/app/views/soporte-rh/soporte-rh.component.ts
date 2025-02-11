import { Component } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { NgIf } from '@angular/common';
import { CookieService } from 'ngx-cookie-service';
import { CNavBarComponent } from '../../components/c-nav-bar/c-nav-bar.component';
import { CFlechasComponent } from '../../components/c-flechas/c-flechas.component';
@Component({
  selector: 'app-soporte-rh',
  standalone: true,
  imports: [RouterLink, ButtonModule, NgIf, CNavBarComponent, CFlechasComponent],
  templateUrl: './soporte-rh.component.html',
  styleUrl: './soporte-rh.component.css'
})
export class SoporteRhComponent {

  categoria:string = ''

  constructor(private cookie:CookieService, private router:Router){}

  reporte(categoria:string){
    if(categoria === 'Nominas'){
      this.cookie.set('categoria',categoria)
      this.router.navigate(['/nomina'])
    }
    if(categoria === 'Retiro Ahorro'){
      this.cookie.set('categoria',categoria)
      this.router.navigate(['/retiro-ahorro'])
    }
    if(categoria === 'Gafete'){
      this.cookie.set('categoria',categoria)
      this.router.navigate(['/solicitud-gafete'])
    }
    if(categoria === 'Consulta Vacaciones'){
      this.cookie.set('categoria',categoria)
      this.router.navigate(['/consultar-vacaciones'])
    }
    if(categoria === 'Atencion Personal'){
      this.cookie.set('categoria',categoria)
      this.router.navigate(['/nominas'])
    }
    if(categoria === 'Enfermeria'){
      this.cookie.set('categoria',categoria)
      this.router.navigate(['/consulta-medica'])
    }
  }
}
