import { Component, OnInit } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { ApiService } from '../../service/api.service';
import { NgFor, NgIf } from '@angular/common';
import { DatePipe } from '@angular/common';
import { CookieService } from 'ngx-cookie-service';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';
import { CNavBarComponent } from '../../components/c-nav-bar/c-nav-bar.component';
import { CFlechasComponent } from '../../components/c-flechas/c-flechas.component';

@Component({
  selector: 'app-solicitudes',
  standalone: true,
  imports: [RouterLink, NgFor, DatePipe, ReactiveFormsModule, NgIf, CNavBarComponent,CFlechasComponent],
  templateUrl: './solicitudes.component.html',
  styleUrl: './solicitudes.component.css'
})
export class SolicitudesComponent implements OnInit{

  reportes: any[] = [];
  filtrosForm: FormGroup
  error: boolean = false

  constructor(private apiService:ApiService, private cookie:CookieService, private router:Router){
    this.filtrosForm = new FormGroup({
      categoria: new FormControl(''),
      estatus: new FormControl(''),
      planta: new FormControl(''),
    })
  }

  ngOnInit(): void {
    this.apiService.reportes().subscribe(
      response =>{
        this.reportes = response.reportes
        console.log(this.reportes)
      }
    )
  }

  abrir_reporte(id:string){
    this.cookie.set('user',id)
    this.router.navigate(['/solicitud'])
  }

  filtrar_reportes(){
    this.apiService.filtrar_reporte(this.filtrosForm.value).subscribe(
      reporte =>{
        this.reportes = reporte.reportes
        console.log(reporte)
        this.error = false
      },error=>{
        if(error.status === 404){
          this.error = true
        }
      }
    )
  }
}
