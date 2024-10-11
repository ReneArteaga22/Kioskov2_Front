import { Component } from '@angular/core';
import { CFormularioSoporteRhComponent } from '../../../components/c-formulario-soporte-rh/c-formulario-soporte-rh.component';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-consultar-vacaciones',
  standalone: true,
  imports: [CFormularioSoporteRhComponent, RouterLink],
  templateUrl: './consultar-vacaciones.component.html',
  styleUrl: './consultar-vacaciones.component.css'
})
export class ConsultarVacacionesComponent {

}
