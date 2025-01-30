import { Component } from '@angular/core';
import { CNavBarComponent } from '../../../components/c-nav-bar/c-nav-bar.component';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { DialogModule } from 'primeng/dialog';
import { ReactiveFormsModule } from '@angular/forms';
import { ApiService } from '../../../service/api.service';
import { NgIf } from '@angular/common';
import { CFlechasComponent } from '../../../components/c-flechas/c-flechas.component';

@Component({
  selector: 'app-limpieza-guest',
  standalone: true,
  imports: [CNavBarComponent, DialogModule, ReactiveFormsModule, NgIf, CFlechasComponent],
  templateUrl: './limpieza-guest.component.html',
  styleUrl: './limpieza-guest.component.css'
})
export class LimpiezaGuestComponent {

  visible: boolean = false;
  selectedOption: string | null = null;
  limpiezaForm:FormGroup
  isSubmit:boolean = false
  error:boolean = false
  
  constructor(private apiService:ApiService){
    this.limpiezaForm = new FormGroup({
      calificacion: new FormControl('',[Validators.required]),
      comentario: new FormControl(''),
      planta: new FormControl('',[Validators.required]),
      servicio: new FormControl('limpieza')
    })
  }

  enviar() {
    if (this.limpiezaForm.invalid) {
      this.error = true;
      return;
    }
    if (this.limpiezaForm.valid && !this.isSubmit) {
      this.apiService.evaluar_servicio(this.limpiezaForm.value).subscribe(
        response => {
          this.visible = true;
          console.log(response)
          setTimeout(() => {
            this.visible = false;
            this.limpiezaForm.reset(); 
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
    this.limpiezaForm.patchValue({ calificacion: calificacion, servicio:servicio });
  }

}
