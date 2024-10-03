import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

//importacion de componentes 
import { CNavBarComponent } from '../../../components/c-nav-bar/c-nav-bar.component';
@Component({
  selector: 'app-evaluacion-servicios',
  standalone: true,
  imports: [RouterLink, CNavBarComponent],
  templateUrl: './evaluacion-servicios.component.html',
  styleUrl: './evaluacion-servicios.component.css'
})
export class EvaluacionServiciosComponent {

}
