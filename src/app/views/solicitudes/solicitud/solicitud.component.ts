import { Component, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { ApiService } from '../../../service/api.service';
import { CookieService } from 'ngx-cookie-service';

@Component({
  selector: 'app-solicitud',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './solicitud.component.html',
  styleUrl: './solicitud.component.css'
})
export class SolicitudComponent implements OnInit{

  reporte: any
  constructor(private apiService:ApiService, private cookies:CookieService){

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

}
