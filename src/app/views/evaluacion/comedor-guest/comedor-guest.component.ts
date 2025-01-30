import { Component } from '@angular/core';
import { CNavBarComponent } from '../../../components/c-nav-bar/c-nav-bar.component';
import { RouterLink } from '@angular/router';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';
import { DialogModule } from 'primeng/dialog';
import { ApiService } from '../../../service/api.service';
import { NgIf } from '@angular/common';
import { NgFor } from '@angular/common';
import { CFlechasComponent } from '../../../components/c-flechas/c-flechas.component';

@Component({
  selector: 'app-comedor-guest',
  standalone: true,
  imports: [CNavBarComponent, RouterLink, DialogModule, ReactiveFormsModule, NgIf, NgFor, CFlechasComponent],
  templateUrl: './comedor-guest.component.html',
  styleUrl: './comedor-guest.component.css'
})
export class ComedorGuestComponent {

  comunicado:any
  visibleMenu: boolean = false
  visible: boolean = false;
  comedorForm:FormGroup
  selectedOption: string | null = null;
  isSubmit:boolean = false
  error:boolean = false

  constructor(private apiService:ApiService){
    this.comedorForm = new FormGroup({
      calificacion: new FormControl('',[Validators.required]),
      comentario: new FormControl(''),
      planta: new FormControl('',[Validators.required]),
      servicio: new FormControl('comedor')
    })
  }

  enviar(){
    if (this.comedorForm.invalid) {
      this.error = true;
      return;
    }
    if (this.comedorForm.valid && !this.isSubmit) {
      this.apiService.evaluar_servicio(this.comedorForm.value).subscribe(
        response => {
          this.visible = true;
          console.log(response)
          setTimeout(() => {
            this.visible = false;
            this.comedorForm.reset(); 
            this.selectedOption = null;  
            location.reload();
          }, 1600);
        },
        error => {
          if (error.status === 400) {
            this.error = true;
          }
        }
      )
    }
  }

  calificacion(calificacion: string, servicio: string) {
    this.selectedOption = calificacion;
    this.comedorForm.patchValue({ calificacion: calificacion, servicio:servicio });
  }

  menu(){
    this.apiService.menu_comunicado().subscribe(
      response =>{
        this.comunicado = response.comunicados
        this.visibleMenu = true
        console.log(this.comunicado)
      }
    )
  }
}
