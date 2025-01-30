import { Component } from '@angular/core';
import { CFormularioSoporteRhComponent } from '../../../components/c-formulario-soporte-rh/c-formulario-soporte-rh.component';
import { RouterLink } from '@angular/router';
import { CNavBarComponent } from '../../../components/c-nav-bar/c-nav-bar.component';
import { CFlechasComponent } from '../../../components/c-flechas/c-flechas.component';
@Component({
  selector: 'app-solicitud-gafete',
  standalone: true,
  imports: [CFormularioSoporteRhComponent, RouterLink, CNavBarComponent, CFlechasComponent],
  templateUrl: './solicitud-gafete.component.html',
  styleUrl: './solicitud-gafete.component.css'
})
export class SolicitudGafeteComponent {

}
