import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';
import { ApiService } from '../../service/api.service';
import { CookieService } from 'ngx-cookie-service';
import { Router } from '@angular/router';
import { NgIf } from '@angular/common';
import { TriStateCheckboxModule } from 'primeng/tristatecheckbox';
import { DialogModule } from 'primeng/dialog';

@Component({
  selector: 'app-c-formulario-soporte-rh',
  standalone: true,
  imports: [ReactiveFormsModule, NgIf,TriStateCheckboxModule, DialogModule],
  templateUrl: './c-formulario-soporte-rh.component.html',
  styleUrl: './c-formulario-soporte-rh.component.css'
})
export class CFormularioSoporteRhComponent{

  isSubmitting: boolean = false;
  visible:boolean = false
  hoy: string = ''
  isSubmit: boolean = false
  error: boolean = false
  soporterhForm: FormGroup
  planta: string = ''

  constructor(private apiService:ApiService, private cookie:CookieService, private router:Router){
    
    const ahora = new Date();
    ahora.setHours(ahora.getHours() - 6); 
    this.hoy = ahora.toISOString().substring(0, 16)

    
    this.soporterhForm = new FormGroup({
      categoria: new FormControl(this.cookie.get('categoria')),
      no_empleado: new FormControl('',Validators.required),
      grupo: new FormControl('',Validators.required),
      nombre: new FormControl('',Validators.required),
      descripcion: new FormControl('',Validators.required),
      planta: new FormControl('',Validators.required),
      telefono: new FormControl('',Validators.required),
    })
  }


  enviar(){
    if(this.soporterhForm.value && !this.isSubmit){
      this.isSubmitting = true
      this.apiService.reporte_soporte_recursos_humanos(this.soporterhForm.value).subscribe(
        response =>{
          this.soporterhForm.reset()
          this.visible = true
          setTimeout(()=>{
            this.visible=false
            this.isSubmitting = false
            this.router.navigate(['/soporte-rh-modulos'])
          },1600)
        }
      )
    }
  }
}
