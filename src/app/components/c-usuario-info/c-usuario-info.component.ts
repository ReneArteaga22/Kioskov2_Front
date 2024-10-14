import { Component } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-c-usuario-info',
  standalone: true,
  imports: [RouterLink, ReactiveFormsModule],
  templateUrl: './c-usuario-info.component.html',
  styleUrl: './c-usuario-info.component.css'
})
export class CUsuarioInfoComponent {

  editarForm: FormGroup
  isEditing: boolean = false

  constructor(){
    this.editarForm = new FormGroup({
      nombre: new FormControl(),
      apellidos: new FormControl()
    })
  }

  editar() {
  }
  
}
