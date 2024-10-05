import { Component, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { ApiService } from '../../service/api.service';
import { UsuariosResponse } from '../../service/api.service';
import { Usuario } from '../../service/api.service';
import { NgFor } from '@angular/common';
import { FormControl, FormGroup, Validators,ReactiveFormsModule} from '@angular/forms';

@Component({
  selector: 'app-usuarios',
  standalone: true,
  imports: [RouterLink, NgFor, ReactiveFormsModule],
  templateUrl: './usuarios.component.html',
  styleUrl: './usuarios.component.css'
})
export class UsuariosComponent implements OnInit {
  buscarUsuarioForm: FormGroup
  isSubmit: boolean = false
  
  usuarios: Usuario[] = [];

  constructor(private apiService:ApiService){
    this.buscarUsuarioForm = new FormGroup({
      nombre: new FormControl('',[Validators.required]),
      area: new FormControl('',[Validators.required])
    })
  }

  ngOnInit(): void {
    this.apiService.lista_usuarios().subscribe(
      (response: UsuariosResponse) => {
        this.usuarios = response.usuarios
        console.log('lista usuarios', this.usuarios);
      },error => {
        console.error('Error al obtener la lista de usuarios', error);
      }
    ) 
  }

  buscar_usuario(){
    if(this.buscarUsuarioForm.valid && !this.isSubmit){
      this.apiService.buscar_usuario(this.buscarUsuarioForm.value).subscribe(
        (response: UsuariosResponse) => {
          this.usuarios = response.usuarios
          console.log('usuario encontrado',this.usuarios)
          console.log('bolilllo')
        }
      )
    }
  }


  alert(){
    alert('alert')
  }
}
