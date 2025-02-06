import { Component } from '@angular/core';
import { CNavBarComponent } from '../../components/c-nav-bar/c-nav-bar.component';
import { CFlechasComponent } from '../../components/c-flechas/c-flechas.component';

@Component({
  selector: 'app-encuestas',
  standalone: true,
  imports: [CNavBarComponent, CFlechasComponent],
  templateUrl: './encuestas.component.html',
  styleUrl: './encuestas.component.css'
})
export class EncuestasComponent {

}
