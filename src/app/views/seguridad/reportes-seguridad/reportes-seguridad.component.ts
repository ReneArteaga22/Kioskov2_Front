import { Component, OnInit } from '@angular/core';
import { CNavBarComponent } from '../../../components/c-nav-bar/c-nav-bar.component';
import { ApiService } from '../../../service/api.service';
CNavBarComponent

@Component({
  selector: 'app-reportes-seguridad',
  standalone: true,
  imports: [CNavBarComponent],
  templateUrl: './reportes-seguridad.component.html',
  styleUrl: './reportes-seguridad.component.css'
})
export class ReportesSeguridadComponent implements OnInit{

  constructor(private apiService:ApiService){}

  ngOnInit(): void {
    this.apiService.reportes_seguridad().subscribe(
      data =>{
        console.log(data)
      }
    )
  }

}
