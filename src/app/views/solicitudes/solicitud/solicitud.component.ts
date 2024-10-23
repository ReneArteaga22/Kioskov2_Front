import { Component, OnInit } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { ApiService } from '../../../service/api.service';
import { CookieService } from 'ngx-cookie-service';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-solicitud',
  standalone: true,
  imports: [RouterLink, DatePipe],
  templateUrl: './solicitud.component.html',
  styleUrl: './solicitud.component.css'
})
export class SolicitudComponent implements OnInit{

  reporte: any
  constructor(private apiService:ApiService, private cookies:CookieService, private router:Router){

  }

  ngOnInit(): void {
    const id = this.cookies.get('user')
    console.log(id)
    this.apiService.reporte_x_id(id).subscribe(
      usuario =>{
        this.reporte = usuario.reporte
        console.log(this.reporte)
      }
    )
  }

  cambiar_estado(estatus:string){
    let id = this.cookies.get('user')
    this.apiService.actualizar_estado_reporte(id, estatus).subscribe(
      response =>{
        console.log(response)
        this.router.navigate(['/solicitudes'])
      }
    )
  }
}
