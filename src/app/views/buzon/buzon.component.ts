import { Component } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { ApiService } from '../../service/api.service';
import { ReactiveFormsModule } from '@angular/forms';
import { NgIf } from '@angular/common';
import { DialogModule } from 'primeng/dialog';


@Component({
  selector: 'app-buzon',
  standalone: true,
  imports: [RouterLink, ReactiveFormsModule, NgIf, DialogModule],
  templateUrl: './buzon.component.html',
  styleUrl: './buzon.component.css'
})
export class BuzonComponent {
  visible:boolean = false
  sugerenciaForm: FormGroup
  isSubmit: boolean = false
  error:boolean = false
  
  constructor(private apiService:ApiService, private router:Router){
    this.sugerenciaForm = new FormGroup({
      sugerencia: new FormControl('')
    })
  }

  mandar_sugerencia(){
    if(this.sugerenciaForm.valid && !this.isSubmit){
      this.apiService.crear_sugerencia(this.sugerenciaForm.value).subscribe(
        response=>{
          this.visible = true

          setTimeout(()=>{
            this.router.navigate(['/'])
            this.visible = false
          },1600)

        },error=>{
          if(error.status === 400){
            this.error = true
          }
        }
      )
    }
  }
}
