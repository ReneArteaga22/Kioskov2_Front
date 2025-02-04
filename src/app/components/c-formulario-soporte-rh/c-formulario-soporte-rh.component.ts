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
      no_empleado: new FormControl('',[Validators.required]),
      grupo: new FormControl(''),
      nombre: new FormControl(''),
      descripcion: new FormControl('',[Validators.required]),
      planta: new FormControl(''),
      telefono: new FormControl(''),
    })
  }


  click(plant: string) {
    this.planta = plant
    console.log(this.planta)
    return this.planta
  }

  ActiveModal(){
    if(this.soporterhForm.valid && !this.isSubmit){
      this.visible = true
      setTimeout(() => { 
        this.router.navigate(['/seguridad']); 
        this.visible = false; 
      }, 1600);
      this.enviar()
    }else{
      this.error = true;
      return;
    }
  }

  enviar() {
    console.log(this.soporterhForm.value);
    if (this.soporterhForm.valid && !this.isSubmit) {
      this.apiService.reporte_soporte_recursos_humanos(this.soporterhForm.value).subscribe(
        response => {
          this.visible = true
          this.cookie.delete('categoria');

          setTimeout(()=>{
            this.visible = false
            this.router.navigate(['/soporte-rh-modulos'])
            this.isSubmit = false
          },1600)
        },error =>{
          if(error.status ===400 )[
            this.error = true
          ]
        }
      )
    }
  }
}
