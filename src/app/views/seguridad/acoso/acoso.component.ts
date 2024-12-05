import { Component, OnInit } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { CNavBarComponent } from '../../../components/c-nav-bar/c-nav-bar.component';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ApiService } from '../../../service/api.service';
import { DialogModule } from 'primeng/dialog';
import { ReactiveFormsModule } from '@angular/forms';
import { NgIf } from '@angular/common';


@Component({
  selector: 'app-acoso',
  standalone: true,
  imports: [RouterLink, CNavBarComponent, DialogModule, ReactiveFormsModule, NgIf],
  templateUrl: './acoso.component.html',
  styleUrl: './acoso.component.css'
})
export class AcosoComponent {

  error:boolean = false
  visible:boolean = false
  visibleReporte:boolean = false
  isSubmit:boolean = false
  acosoForm: FormGroup
  
  constructor(private apiService:ApiService, private router:Router) {
    this.acosoForm = new FormGroup({
      categoria: new FormControl('acoso'),
      nombre: new FormControl,
      num_empleado:new FormControl,
      descripcion: new FormControl('',[Validators.required])
    })
  }

  ngOnInit(): void {
    this.visible = true
    setTimeout(()=>{
      this.visible=false
    },5000)
  }

  ActiveModal(){
    if (this.acosoForm.invalid) {
      this.error = true;
      return;
    }
    if(this.acosoForm.valid && !this.isSubmit){
      this.visibleReporte = true
      setTimeout(() => { 
        this.router.navigate(['/seguridad']); 
        this.visibleReporte = false; 
      }, 1600);
      this.enviar()
    }
  }

  enviar(){
    console.log(this.acosoForm.value)
    if(this.acosoForm.valid && !this.isSubmit){
      this.apiService.crear_reporte_seguridad(this.acosoForm.value).subscribe(
        response =>{
          console.log(response)
          this.visibleReporte = true

          setTimeout(() => { 
            this.router.navigate(['/seguridad']); 
            this.visibleReporte = false; 
          }, 1600);

        },error =>{
          if(error.status === 500){
            this.error = true
          }
        }
      )
    }
  }
}
