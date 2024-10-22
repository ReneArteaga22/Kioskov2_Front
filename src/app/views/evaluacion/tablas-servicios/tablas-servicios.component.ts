import { Component } from '@angular/core';
import { CNavBarComponent } from '../../../components/c-nav-bar/c-nav-bar.component';
import { Router } from '@angular/router';

@Component({
  selector: 'app-tablas-servicios',
  standalone: true,
  imports: [CNavBarComponent],
  templateUrl: './tablas-servicios.component.html',
  styleUrl: './tablas-servicios.component.css'
})
export class TablasServiciosComponent {
  isComedor:boolean = false
  constructor(private router:Router){}

  servicio(servicioClick:string){
    if(servicioClick === 'transporte'){
      this.router.navigate(['/resultados-evaluacion-transporte'])
    }

    if(servicioClick === 'comedor'){
      this.router.navigate(['/resultados-evaluacion-comedor'])
    }
  }
}
