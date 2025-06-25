import { Component, OnInit } from '@angular/core';
import { SidebarModule } from 'primeng/sidebar';
import { ButtonModule } from 'primeng/button';
import { Router, RouterLink } from '@angular/router';
import { CardModule } from 'primeng/card';
import { CFlechasComponent } from '../../../components/c-flechas/c-flechas.component';
import { CookieService } from 'ngx-cookie-service';
import { ApiService } from '../../../service/api.service';
import { Avance } from '../../../service/api.service';
import Swal from 'sweetalert2';

//importando componentes 
import { CNavBarComponent } from '../../../components/c-nav-bar/c-nav-bar.component'; 
import { CommonModule } from '@angular/common';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';

@Component({
  selector: 'app-avance',
  standalone: true,
  imports: [ RouterLink, CNavBarComponent, CFlechasComponent, CommonModule, ReactiveFormsModule ],
  templateUrl: './avance.component.html',
  styleUrl: './avance.component.css'
})
export class AvanceComponent implements OnInit
{
    usuario:number = 0
    nombre:string = ''
  constructor(private galleta:CookieService, private apiService:ApiService){}
  ngOnInit()
  {
    let id=this.galleta.get('user_num')
    this.apiService.usuario_x_id(id).subscribe(
      response=>{
        this.usuario = response.usuario.id
        this.nombre = response.usuario.nombre
        console.log(this.usuario)
        this.FormAvance.patchValue({
          userId: this.usuario
        });
        
      },error =>{
        if(error.status === 400){
          console.log('No deberias estar viendo esto... 😑')
        }
      }
    )
  }

  public FormAvance = new FormGroup({
    userId: new FormControl<number>(0), 
    porcentajeAvance: new FormControl<number | null>(null, [
      Validators.required,
      Validators.min(1),
      Validators.max(100)
    ])
  });

   RegistrarAvance()
    {
      if(this.FormAvance.valid) {
        const formData = this.FormAvance.value;
        this.apiService.avanceInventario({
        userId: Number(formData.userId),
        porcentajeAvance: Number(formData.porcentajeAvance)
        }).subscribe
        ({
          next: (response) => {
            Swal.fire('Exito', 'Avance registrado correctamente', 'success');
            this.FormAvance.reset();
            this.FormAvance.patchValue({
              userId: this.usuario
            });
          },
          error: (err) => {
            Swal.fire('Error', 'No se pudo registrar el avance', 'error');
          }
        });
      } else 
      {
        this.mostrarErrores()
        this.FormAvance.reset()
      }
  }

   mostrarErrores()
      {
        const errores=[]
        if(this.FormAvance.get('porcentajeAvance')?.hasError('required'))
        {
          errores.push('completa el formulario')
        }
        if(this.FormAvance.get('porcentajeAvance')?.hasError('min'))
        {
          errores.push('rango del 1 al 100')
        }
         if(this.FormAvance.get('porcentajeAvance')?.hasError('max'))
        {
          errores.push('rango del 1 al 100')
        }
        if (errores.length > 0)
        {
          Swal.fire('Error',errores.join(', '), 'error'); 
          return false;
        }
        return true;
      }
}
