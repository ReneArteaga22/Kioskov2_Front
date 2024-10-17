import { Component } from '@angular/core';
import { FormControl, FormGroup, Validators,ReactiveFormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { CNavBarComponent } from '../../../components/c-nav-bar/c-nav-bar.component';
import { ApiService } from '../../../service/api.service';
import { NgClass } from '@angular/common';

@Component({
  selector: 'app-comedor',
  standalone: true,
  imports: [RouterLink, ReactiveFormsModule, CNavBarComponent, NgClass],
  templateUrl: './comedor.component.html',
  styleUrl: './comedor.component.css'
})
export class ComedorComponent {
  selectedOption: string = '';
  comedorForm: FormGroup
  isSubmit: boolean = false
  

  constructor(private router:Router, private apiService:ApiService){
    this.comedorForm = new FormGroup({
      calificacion: new FormControl('',[Validators.required]),
      comentario: new FormControl('',[Validators.required]),
      planta: new FormControl('',[Validators.required]),
      servicio: new FormControl('',[Validators.required])
    })
  }

  calificacion(calificacion: string, servicio: string) {
    this.selectedOption = calificacion;
    this.comedorForm.patchValue({ calificacion: calificacion, servicio:servicio });
  }

  enviar(){
    if(this.comedorForm.valid && !this.isSubmit){
      this.apiService.evaluar_servicio(this.comedorForm.value).subscribe(
        response =>{
          console.log(response)
          this.router.navigate(['/servicios'])
        }
      )
    }
  }
}
