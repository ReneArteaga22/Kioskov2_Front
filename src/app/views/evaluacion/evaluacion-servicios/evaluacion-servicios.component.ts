import { Component } from '@angular/core';
import { Router, RouterLink } from '@angular/router';

//importacion de componentes 
import { CNavBarComponent } from '../../../components/c-nav-bar/c-nav-bar.component';
import { CookieService } from 'ngx-cookie-service';
@Component({
  selector: 'app-evaluacion-servicios',
  standalone: true,
  imports: [RouterLink, CNavBarComponent],
  templateUrl: './evaluacion-servicios.component.html',
  styleUrl: './evaluacion-servicios.component.css'
})
export class EvaluacionServiciosComponent {

  constructor(private router:Router, private cookie:CookieService){}

  servicio(servicioClick:string){
    if(servicioClick === 'transporte'){
      this.router.navigate(['/transporte'])
    }

    if(servicioClick === 'comedor'){
      this.router.navigate(['/comedor'])
    }
  }

}
