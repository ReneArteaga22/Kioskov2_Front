import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { CFormularioSoporteRhComponent } from '../../../components/c-formulario-soporte-rh/c-formulario-soporte-rh.component';
import { CNavBarComponent } from '../../../components/c-nav-bar/c-nav-bar.component';
import { CFlechasComponent } from '../../../components/c-flechas/c-flechas.component';

@Component({
  selector: 'app-consulta-medica',
  standalone: true,
  imports: [RouterLink, CFormularioSoporteRhComponent, CNavBarComponent, CFlechasComponent],
  templateUrl: './consulta-medica.component.html',
  styleUrl: './consulta-medica.component.css'
})
export class ConsultaMedicaComponent {

}