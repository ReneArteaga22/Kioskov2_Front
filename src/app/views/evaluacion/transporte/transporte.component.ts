import { Component } from '@angular/core';
import { FormControl, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { CNavBarComponent } from '../../../components/c-nav-bar/c-nav-bar.component';
import { ApiService } from '../../../service/api.service';
import { DialogModule } from 'primeng/dialog';

@Component({
  selector: 'app-transporte',
  standalone: true,
  imports: [RouterLink, ReactiveFormsModule, CNavBarComponent, DialogModule],
  templateUrl: './transporte.component.html',
  styleUrl: './transporte.component.css'
})
export class TransporteComponent {
  visible:boolean = false
  selectedOption: string = '';
  transporteForm:FormGroup
  isSubmit:boolean = false

  constructor(private router:Router, private apiService:ApiService){
    this.transporteForm = new FormGroup({
      calificacion: new FormControl('',[Validators.required]),
      comentario: new FormControl(''),
      servicio: new FormControl('',[Validators.required])
    })
  }

  calificacion(calificacion: string, servicio: string) {
    this.selectedOption = calificacion;
    this.transporteForm.patchValue({ calificacion: calificacion, servicio:servicio });
  }
  
  enviar(){
    if(this.transporteForm.valid && !this.isSubmit){
      this.apiService.evaluar_servicio(this.transporteForm.value).subscribe(
        response =>{
          this.visible = true
          
          setTimeout(()=>{
            this.visible = false
            this.router.navigate(['/servicios'])
          },1600)
        }
      )
    }
  }
}
