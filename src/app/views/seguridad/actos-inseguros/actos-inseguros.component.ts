import { Component, OnInit } from '@angular/core';
import { Route, Router, RouterLink } from '@angular/router';
import { CNavBarComponent } from '../../../components/c-nav-bar/c-nav-bar.component';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { ApiService } from '../../../service/api.service';
import { DialogModule } from 'primeng/dialog';
import { ReactiveFormsModule } from '@angular/forms';
import { NgIf } from '@angular/common';

@Component({
  selector: 'app-actos-inseguros',
  standalone: true,
  imports: [RouterLink, CNavBarComponent, DialogModule, ReactiveFormsModule, NgIf],
  templateUrl: './actos-inseguros.component.html',
  styleUrl: './actos-inseguros.component.css'
})
export class ActosInsegurosComponent implements OnInit {

  error:boolean = false
  visibleReporte:boolean = false
  visible:boolean = false
  isSubmit:boolean = false
  actosForm: FormGroup
  
  constructor(private apiService:ApiService, private router:Router) {
    this.actosForm = new FormGroup({
      categoria: new FormControl('actos_inseguros'),
      nombre: new FormControl('',[Validators.required]),
      num_empleado:new FormControl('',[Validators.required]),
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
    if(this.actosForm.valid && !this.isSubmit){
      this.visibleReporte = true
      setTimeout(() => { 
        this.router.navigate(['/seguridad']); 
        this.visibleReporte = false; 
      }, 1600);
      this.enviar()
    }else{
      this.error = true;
      return;
    }
  }

  enviar(){
    console.log(this.actosForm.value)
    if(this.actosForm.valid && !this.isSubmit){
      this.apiService.crear_reporte_seguridad(this.actosForm.value).subscribe(
        response =>{
          console.log(response)
        },error =>{
          if(error.status === 500){
            this.error = true
          }
        }
      )
    }
  }
}
