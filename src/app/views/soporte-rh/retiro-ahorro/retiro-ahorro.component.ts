import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { CFormularioSoporteRhComponent } from '../../../components/c-formulario-soporte-rh/c-formulario-soporte-rh.component';
import { CBarComponent } from '../../../components/c-bar/c-bar.component';

@Component({
  selector: 'app-retiro-ahorro',
  standalone: true,
  imports: [RouterLink, CFormularioSoporteRhComponent, CBarComponent],
  templateUrl: './retiro-ahorro.component.html',
  styleUrl: './retiro-ahorro.component.css'
})
export class RetiroAhorroComponent {

}
