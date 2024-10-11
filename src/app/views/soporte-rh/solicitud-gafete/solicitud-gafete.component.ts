import { Component } from '@angular/core';
import { CFormularioSoporteRhComponent } from '../../../components/c-formulario-soporte-rh/c-formulario-soporte-rh.component';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-solicitud-gafete',
  standalone: true,
  imports: [CFormularioSoporteRhComponent, RouterLink],
  templateUrl: './solicitud-gafete.component.html',
  styleUrl: './solicitud-gafete.component.css'
})
export class SolicitudGafeteComponent {

}
