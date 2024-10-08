import { Component, OnInit } from '@angular/core';
import { CNavBarComponent } from '../../../components/c-nav-bar/c-nav-bar.component';
import { ChartModule } from 'primeng/chart';
import { ApiService } from '../../../service/api.service';
import { NgFor } from '@angular/common';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-resultados-evaluacion-transporte',
  standalone: true,
  imports: [CNavBarComponent, ChartModule, NgFor, DatePipe],
  templateUrl: './resultados-evaluacion-transporte.component.html',
  styleUrl: './resultados-evaluacion-transporte.component.css'
})
export class ResultadosEvaluacionTransporteComponent implements OnInit {
  evaluaciones:any[] = []
  basicData: any;
  basicOptions: any;

  constructor(private apiService:ApiService) {
    this.basicData = {
      labels: ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo'],
      datasets: [
        {
          label: 'Muy buenas',
          backgroundColor:'green',
          data: [65, 59, 80, 81, 56]
        },
        {
          label: 'Buenas',
          backgroundColor: 'yellow',
          data: [28, 48, 40, 19, 86]
        },
        {
          label: 'Malas',
          backgroundColor: 'orange',
          data: [28, 48, 40, 19, 86]
        },
        {
          label: 'Muy malas',
          backgroundColor: 'red',
          data: [28, 48, 40, 19, 86]
        }
      ]
    };

    this.basicOptions = {
      responsive: true,
      maintainAspectRatio: false,
      scales: {
        xAxes: [
          {
            barPercentage: 0.5,
            categoryPercentage: 0.5
          }
        ]
      }
    };
  }

  ngOnInit(): void {
    this.apiService.resultados_evaluacion_comedor().subscribe(
      response =>{
        this.evaluaciones = response.evaluaciones
        console.log('chichis?',this.evaluaciones)
      }
    )
  }
}
