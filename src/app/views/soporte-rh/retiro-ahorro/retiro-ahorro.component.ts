import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { CFormularioSoporteRhComponent } from '../../../components/c-formulario-soporte-rh/c-formulario-soporte-rh.component';

@Component({
  selector: 'app-retiro-ahorro',
  standalone: true,
  imports: [RouterLink, CFormularioSoporteRhComponent],
  templateUrl: './retiro-ahorro.component.html',
  styleUrl: './retiro-ahorro.component.css'
})
export class RetiroAhorroComponent {

}
