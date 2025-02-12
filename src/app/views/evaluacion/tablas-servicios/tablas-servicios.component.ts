import { Component } from '@angular/core';
import { CNavBarComponent } from '../../../components/c-nav-bar/c-nav-bar.component';
import { Router } from '@angular/router';
import { RouterLink } from '@angular/router';
import { CFlechasComponent } from '../../../components/c-flechas/c-flechas.component';

@Component({
  selector: 'app-tablas-servicios',
  standalone: true,
  imports: [CNavBarComponent, RouterLink, CFlechasComponent],
  templateUrl: './tablas-servicios.component.html',
  styleUrl: './tablas-servicios.component.css'
})
export class TablasServiciosComponent {
  
  constructor(private router:Router){}

  servicio(servicioClick:string){
    if(servicioClick === 'transporte'){
      this.router.navigate(['/resultados-evaluacion-transporte'])
    }
    if(servicioClick === 'comedor'){
      this.router.navigate(['/resultados-evaluacion-comedor'])
    }
    if(servicioClick === 'limpieza'){
      this.router.navigate(['/resultados-evaluacion-limpieza'])
    }
    if(servicioClick === 'enfermeria'){
      this.router.navigate(['/resultados-evaluacion-enfermeria'])
    }
  }
}
