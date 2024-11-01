import { Component } from '@angular/core';
import { CFormularioSoporteRhComponent } from '../../../components/c-formulario-soporte-rh/c-formulario-soporte-rh.component';
import { RouterLink } from '@angular/router';
import { CBarComponent } from '../../../components/c-bar/c-bar.component';

@Component({
  selector: 'app-nominas',
  standalone: true,
  imports: [CFormularioSoporteRhComponent, RouterLink, CBarComponent],
  templateUrl: './nominas.component.html',
  styleUrl: './nominas.component.css'
})
export class NominasComponent {

}
