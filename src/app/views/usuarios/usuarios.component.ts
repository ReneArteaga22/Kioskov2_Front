import { Component, OnInit } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { ApiService } from '../../service/api.service';
import { NgFor } from '@angular/common';
import { FormControl, FormGroup, ReactiveFormsModule} from '@angular/forms';
import { CookieService } from 'ngx-cookie-service';

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
  usuarios: any[] = [];

  constructor(private apiService:ApiService, private router:Router, private cookie: CookieService){
    this.buscarUsuarioForm = new FormGroup({
      nombre: new FormControl(''),
      area: new FormControl('')
    })
  }

  ngOnInit(): void {
    this.apiService.lista_usuarios().subscribe(
      response => {
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
        response => {
          this.usuarios = response.filtro         
        }
      )
    }
  }

  usuarios_info(id:number){
    this.apiService.usuario_x_id(id).subscribe(
      response =>{
        this.cookie.set('user_id',response.usuario.id)
        this.router.navigate(['/usuarios-info'])
      }
    )
  }
}
