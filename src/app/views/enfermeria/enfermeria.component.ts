
import { CFlechasComponent } from '../../components/c-flechas/c-flechas.component';
import { Component } from '@angular/core';
import { CNavBarComponent } from '../../components/c-nav-bar/c-nav-bar.component';
import { RouterLink } from '@angular/router';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';
import { DialogModule } from 'primeng/dialog';
import { NgIf } from '@angular/common';
import { ApiService } from '../../service/api.service';
import { NgFor } from '@angular/common';

@Component({
  selector: 'app-enfermeria',
  standalone: true,
  imports: [CNavBarComponent, RouterLink, DialogModule, ReactiveFormsModule, NgIf, NgFor, CFlechasComponent],
  templateUrl: './enfermeria.component.html',
  styleUrl: './enfermeria.component.css'
})
export class EnfermeriaComponent {
  
  comunicado:any
  visibleMenu: boolean = false
  visible: boolean = false;
  enfermeriaForm:FormGroup
  selectedOption: string | null = null;
  isSubmit:boolean = false
  error:boolean = false

  constructor(private apiService:ApiService){
    this.enfermeriaForm = new FormGroup({
      calificacion: new FormControl('',[Validators.required]),
      comentario: new FormControl(''),
      planta: new FormControl('',[Validators.required]),
      servicio: new FormControl('enfermeria')
    })
  }

  enviar(){
    if (this.enfermeriaForm.invalid) {
      this.error = true;
      return;
    }
    if (this.enfermeriaForm.valid && !this.isSubmit) {
      this.apiService.evaluar_servicio(this.enfermeriaForm.value).subscribe(
        response => {
          this.visible = true;
          console.log(response)

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
    this.enfermeriaForm.patchValue({ calificacion: calificacion, servicio:servicio });
  }

}
