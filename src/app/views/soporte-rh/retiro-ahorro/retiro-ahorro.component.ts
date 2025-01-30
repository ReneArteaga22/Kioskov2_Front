import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { CFormularioSoporteRhComponent } from '../../../components/c-formulario-soporte-rh/c-formulario-soporte-rh.component';
import { CNavBarComponent } from '../../../components/c-nav-bar/c-nav-bar.component';
import { CFlechasComponent } from '../../../components/c-flechas/c-flechas.component';
@Component({
  selector: 'app-retiro-ahorro',
  standalone: true,
  imports: [RouterLink, CFormularioSoporteRhComponent, CNavBarComponent, CFlechasComponent],
  templateUrl: './retiro-ahorro.component.html',
  styleUrl: './retiro-ahorro.component.css'
})
export class RetiroAhorroComponent {

}
