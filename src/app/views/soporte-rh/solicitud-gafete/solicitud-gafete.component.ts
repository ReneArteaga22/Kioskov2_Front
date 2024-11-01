import { Component } from '@angular/core';
import { CFormularioSoporteRhComponent } from '../../../components/c-formulario-soporte-rh/c-formulario-soporte-rh.component';
import { RouterLink } from '@angular/router';
import { CBarComponent } from '../../../components/c-bar/c-bar.component';

@Component({
  selector: 'app-solicitud-gafete',
  standalone: true,
  imports: [CFormularioSoporteRhComponent, RouterLink, CBarComponent],
  templateUrl: './solicitud-gafete.component.html',
  styleUrl: './solicitud-gafete.component.css'
})
export class SolicitudGafeteComponent {

}
