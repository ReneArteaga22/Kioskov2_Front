import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { NgIf } from '@angular/common';
import { CookieService } from 'ngx-cookie-service';

@Component({
  selector: 'app-soporte-rh',
  standalone: true,
  imports: [RouterLink, ButtonModule, NgIf],
  templateUrl: './soporte-rh.component.html',
  styleUrl: './soporte-rh.component.css'
})
export class SoporteRhComponent {

  categoria:string = ''

  constructor(private cookie:CookieService){}

  reporte(categoria:string){
    if(categoria === 'Nominas'){
      this.cookie.set('categoria',categoria)
      alert('saludo nominas')
    }
    if(categoria === 'Retiro Ahorro'){
      this.cookie.set('categoria',categoria)
      alert('saludos retiro de ahorro')
    }
    if(categoria === 'Gafete'){
      this.cookie.set('categoria',categoria)
      alert('saludos gafete')
    }
    if(categoria === 'Consulta Vacaciones'){
      this.cookie.set('categoria',categoria)
      alert('saludos constulas vacaciones')
    }
    if(categoria === 'Atencion Personal'){
      this.cookie.set('categoria',categoria)
      alert('saludos atencion persnoal')
    }
  }
}
