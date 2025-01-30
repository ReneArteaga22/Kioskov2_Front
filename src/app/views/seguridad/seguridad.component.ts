import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { CNavBarComponent } from '../../components/c-nav-bar/c-nav-bar.component';
import { CFlechasComponent } from '../../components/c-flechas/c-flechas.component';

@Component({
  selector: 'app-seguridad',
  standalone: true,
  imports: [RouterLink, CNavBarComponent, CFlechasComponent],
  templateUrl: './seguridad.component.html',
  styleUrl: './seguridad.component.css'
})
export class SeguridadComponent {
// QUE ONDA RENE
}
