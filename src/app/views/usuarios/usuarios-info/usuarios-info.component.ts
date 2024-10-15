import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { CUsuarioInfoComponent } from '../../../components/c-usuario-info/c-usuario-info.component';

@Component({
  selector: 'app-usuarios-info',
  standalone: true,
  imports: [RouterLink, CUsuarioInfoComponent],
  templateUrl: './usuarios-info.component.html',
  styleUrl: './usuarios-info.component.css'
})
export class UsuariosInfoComponent {

}
