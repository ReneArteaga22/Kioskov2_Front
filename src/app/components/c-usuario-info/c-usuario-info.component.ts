import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { ApiService } from '../../service/api.service';
import { CookieService } from 'ngx-cookie-service';
import { DialogModule } from 'primeng/dialog';
import { NgFor } from '@angular/common';
import { NgIf } from '@angular/common';

@Component({
  selector: 'app-c-usuario-info',
  standalone: true,
  imports: [RouterLink, ReactiveFormsModule, NgFor,NgIf, DialogModule],
  templateUrl: './c-usuario-info.component.html',
  styleUrl: './c-usuario-info.component.css'
})
export class CUsuarioInfoComponent implements OnInit{

  usuario: any
  visible:boolean = false
  isSistemas:boolean = false
  isRh:boolean = false
  editarForm: FormGroup
  isEditing: boolean = false
  isSubmit:boolean = false

  constructor(private apiService: ApiService, private cookie:CookieService){
    this.editarForm = new FormGroup({
      area: new FormControl(),
      puesto: new FormControl(),
      nombre: new FormControl(),
      apellidos: new FormControl(),
      usuario: new FormControl(),
      correo: new FormControl(),
      telefono: new FormControl()
    })
  }

  ngOnInit(): void { 
    let area = this.cookie.get('area')
    if(area === 'sistemas'){
      this.isSistemas = true
    }
    if(area === 'rh'){
      this.isRh = true
    }
    this.cargarDatosUsuario(); 
  } 
  cargarDatosUsuario(){
    const id = this.cookie.get('user_id');this.apiService.usuario_x_id(id).subscribe( 
    response => { 
      this.usuario = response.usuario
      this.editarForm.setValue({ 
        estatus: this.usuario.estatus, 
        area: this.usuario.area, 
        puesto: this.usuario.puesto, 
        nombre: this.usuario.nombre, 
        apellidos: this.usuario.apellidos, 
        usuario: this.usuario.usuario, 
        correo: this.usuario.correo, 
        telefono: this.usuario.telefono 
      }); 
    }, error => { 
      console.error('Error al cargar datos del usuario', error); 
      } 
    ); 
  } 
  editar() { 
    console.log(this.editarForm.value)
    const id = this.cookie.get('user_id'); this.apiService.editar_usuario(id, this.editarForm.value).subscribe( 
      response => { 
        console.log('Usuario actualizado:', response); 
        this.visible = true
        setTimeout(() => { 
          this.visible = false;
          location.reload()
        }, 1400);

      }, error => { 
        console.error('Error al actualizar usuario:', error); 
      } 
    ); 
  }

  activar(estatus:any){
    const id = this.cookie.get('user_id');
    this.apiService.modificar_estado(id, estatus).subscribe(
      response =>{
        this.visible = true
        setTimeout(() => { 
          this.visible = false;
          location.reload()
        }, 1400);
      }
    )
  }

  desactivar(estatus:any){
    const id = this.cookie.get('user_id');
    this.apiService.modificar_estado(id, estatus).subscribe(
      response =>{
        this.visible = true
        setTimeout(() => { 
          this.visible = false;
          location.reload()
        }, 1400);
      }
    )
  }
}
