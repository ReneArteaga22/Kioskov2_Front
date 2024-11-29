import { Component } from '@angular/core';
import { FormControl, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { CBarComponent } from '../../../components/c-bar/c-bar.component';
import { ApiService } from '../../../service/api.service';
import { CookieService } from 'ngx-cookie-service';
import { DialogModule } from 'primeng/dialog';
import { NgIf } from '@angular/common';

@Component({
  selector: 'app-recuperar-contrasena',
  standalone: true,
  imports: [RouterLink, ReactiveFormsModule,CBarComponent, DialogModule, NgIf],
  templateUrl: './recuperar-contrasena.component.html',
  styleUrl: './recuperar-contrasena.component.css'
})
export class RecuperarContrasenaComponent {

  isSubmit:boolean = false
  recuperarForm:FormGroup
  visible:boolean = false
  error:boolean = false

  constructor(private apiService:ApiService, private cookie:CookieService){
    this.recuperarForm = new FormGroup({
      contrasena: new FormControl('',[Validators.required]),
    })
  }

  recuperar(){
    if (this.recuperarForm.invalid) {
      this.error = true;
      return;
    }
    const contrasena = this.recuperarForm.get('contrasena')?.value;
    const id = parseInt(this.cookie.get('user_id'))
    if(this.recuperarForm.valid && !this.isSubmit){
      this.apiService.cambiar_contrasena(id, contrasena).subscribe(
        response =>{
          this.visible = true
          setTimeout(() => { 
            this.visible = false; 
<<<<<<< HEAD
=======
            this.router.navigate(['/'])
            // SI SALE ESTO ES PORQUE EL MERGE SI JALO CHINGAO
>>>>>>> miller
          }, 1600);
        },error => {
          if(error.status === 404 || 500){
            this.error = true
          }
        }
      )
    }
  }
}

