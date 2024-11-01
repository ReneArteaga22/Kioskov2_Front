import { Component } from '@angular/core';
import { CFormularioSoporteRhComponent } from '../../../components/c-formulario-soporte-rh/c-formulario-soporte-rh.component';
import { RouterLink } from '@angular/router';
import { CBarComponent } from '../../../components/c-bar/c-bar.component';

@Component({
  selector: 'app-consultar-vacaciones',
  standalone: true,
  imports: [CFormularioSoporteRhComponent, RouterLink, CBarComponent],
  templateUrl: './consultar-vacaciones.component.html',
  styleUrl: './consultar-vacaciones.component.css'
})
export class ConsultarVacacionesComponent {

}
