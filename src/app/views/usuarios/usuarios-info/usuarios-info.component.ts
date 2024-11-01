import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { CUsuarioInfoComponent } from '../../../components/c-usuario-info/c-usuario-info.component';
import { CBarComponent } from '../../../components/c-bar/c-bar.component';

@Component({
  selector: 'app-usuarios-info',
  standalone: true,
  imports: [RouterLink, CUsuarioInfoComponent, CBarComponent],
  templateUrl: './usuarios-info.component.html',
  styleUrl: './usuarios-info.component.css'
})
export class UsuariosInfoComponent {

}
