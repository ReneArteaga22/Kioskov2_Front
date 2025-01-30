import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { CUsuarioInfoComponent } from '../../../components/c-usuario-info/c-usuario-info.component';
import { CNavBarComponent } from '../../../components/c-nav-bar/c-nav-bar.component';
import { CFlechasComponent } from '../../../components/c-flechas/c-flechas.component';

@Component({
  selector: 'app-usuarios-info',
  standalone: true,
  imports: [RouterLink, CUsuarioInfoComponent, CNavBarComponent, CFlechasComponent],
  templateUrl: './usuarios-info.component.html',
  styleUrl: './usuarios-info.component.css'
})
export class UsuariosInfoComponent {

}
