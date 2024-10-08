import { Component } from '@angular/core';
import { FormControl, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { CNavBarComponent } from '../../../components/c-nav-bar/c-nav-bar.component';
import { ApiService } from '../../../service/api.service';

@Component({
  selector: 'app-transporte',
  standalone: true,
  imports: [RouterLink, ReactiveFormsModule, CNavBarComponent],
  templateUrl: './transporte.component.html',
  styleUrl: './transporte.component.css'
})
export class TransporteComponent {
  transporteForm:FormGroup
  isSubmit:boolean = false

  constructor(private router:Router, private apiService:ApiService){
    this.transporteForm = new FormGroup({
      calificacion: new FormControl('',[Validators.required]),
      comentario: new FormControl('',[Validators.required]),
      servicio: new FormControl('',[Validators.required])
    })
  }

  calificacion(calificacion: string, servicio: string) {
    this.transporteForm.patchValue({ calificacion: calificacion, servicio:servicio });
  }
  
  enviar(){
    if(this.transporteForm.valid && !this.isSubmit){
      this.apiService.evaluar_servicio(this.transporteForm.value).subscribe(
        response =>{
          this.router.navigate(['/servicios'])
        }
      )
    }
  }
}
