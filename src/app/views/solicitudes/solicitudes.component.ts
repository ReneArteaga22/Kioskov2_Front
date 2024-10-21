import { Component, OnInit } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { ApiService } from '../../service/api.service';
import { NgFor } from '@angular/common';
import { DatePipe } from '@angular/common';
import { CookieService } from 'ngx-cookie-service';

@Component({
  selector: 'app-solicitudes',
  standalone: true,
  imports: [RouterLink, NgFor, DatePipe],
  templateUrl: './solicitudes.component.html',
  styleUrl: './solicitudes.component.css'
})
export class SolicitudesComponent implements OnInit{

  reportes: any[] = [];

  constructor(private apiService:ApiService, private cookie:CookieService, private router:Router){

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
}
