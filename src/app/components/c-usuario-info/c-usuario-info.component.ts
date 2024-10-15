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
    let id = parseInt(this.cookie.get('user_id'))
    console.log(this.editarForm.value)

    if(this.editarForm.valid && !this.isSubmit){
      this.apiService.editar_usuario(id, this.editarForm.value).subscribe(
        response =>{
          this.usuario = response.usuario
          console.log(this.usuario, id)
        }
      )
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
