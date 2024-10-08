import { Component, OnInit } from '@angular/core';
import { CNavBarComponent } from '../../../components/c-nav-bar/c-nav-bar.component';
import { ChartModule } from 'primeng/chart';
import { ApiService } from '../../../service/api.service';
import { NgFor } from '@angular/common';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-resultados-evaluacion',
  standalone: true,
  imports: [CNavBarComponent, ChartModule, NgFor, DatePipe],
  templateUrl: './resultados-evaluacion.component.html',
  styleUrl: './resultados-evaluacion.component.css'
})
export class ResultadosEvaluacionComponent implements OnInit {
  evaluaciones: any[] = []; 
  constructor(private apiService:ApiService){}

  ngOnInit(): void {
    this.apiService.resultados_evaluacion_comedor().subscribe(
      response =>{
        this.evaluaciones = response.evaluaciones
        console.log('chichis?',this.evaluaciones)
      }
    )
  }
}