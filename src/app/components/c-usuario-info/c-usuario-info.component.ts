import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { ApiService } from '../../service/api.service';
import { CookieService } from 'ngx-cookie-service';
import { NgFor } from '@angular/common';

@Component({
  selector: 'app-c-usuario-info',
  standalone: true,
  imports: [RouterLink, ReactiveFormsModule, NgFor],
  templateUrl: './c-usuario-info.component.html',
  styleUrl: './c-usuario-info.component.css'
})
export class CUsuarioInfoComponent implements OnInit{

  usuario: any
  editarForm: FormGroup
  isEditing: boolean = false
  isSubmit:boolean =false

  constructor(private apiService: ApiService, private cookie:CookieService){
    this.editarForm = new FormGroup({
      estatus: new FormControl(),
      area: new FormControl(),
      puesto: new FormControl(),
      nombre: new FormControl(),
      apellidos: new FormControl(),
      usuario: new FormControl(),
      correo: new FormControl(),
      telefono: new FormControl()
    })
  }
  editar() {
    let id = parseInt(this.cookie.get('user_id'));
  
    // Obtener los valores del formulario
    const formValues = this.editarForm.value;
  
    // Filtrar el formulario para que solo se envíen campos no vacíos
    const filteredValues = Object.keys(formValues).reduce((acc:any, key) => {
      // Solo agregar los campos que tienen un valor no vacío, null o undefined
      if (formValues[key] !== null && formValues[key] !== undefined && formValues[key] !== '') {
        acc[key] = formValues[key];
      }
      return acc;
    }, {});
  
    // Asegurarse de que el formulario sea válido antes de enviar
    if (this.editarForm.valid) {
      // Llamada a la API para editar el usuario, enviando solo los valores filtrados
      this.apiService.editar_usuario(id, filteredValues).subscribe(
        response => {
          this.usuario = response.usuario;
          console.log(this.usuario, id);
        }
      );
    }
  }

  ngOnInit(): void {
    let id = parseInt(this.cookie.get('user_id'))
    this.apiService.usuario_x_id(id).subscribe(
      response =>{
        this.usuario = response.usuario
        console.log(this.usuario)
      }
    )
  }
}
