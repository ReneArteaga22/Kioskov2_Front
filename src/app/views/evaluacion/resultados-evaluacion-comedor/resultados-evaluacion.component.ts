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

  basicData: any;
  basicOptions: any;
  evaluaciones: any[] = []; 

  constructor(private apiService: ApiService) {}

  ngOnInit(): void {
    this.apiService.resultados_evaluacion_comedor().subscribe(
      response => {
        this.evaluaciones = response.evaluaciones;
        console.log('Evaluaciones:', this.evaluaciones);

        const calificaciones: { [key: string]: number } = { 'Muy bueno': 0, 'Bueno': 0, 'Malo': 0, 'Muy malo': 0 };

        this.evaluaciones.forEach(evaluacion => {
          const calificacion = evaluacion.calificacion as keyof typeof calificaciones;
          if (calificaciones[calificacion] !== undefined) {
            calificaciones[calificacion]++;
          }
        });

        this.basicData = {
          labels: ['Evaluaciones'], 
          datasets: [
            {
              label: 'Muy buenas',
              backgroundColor: 'green',
              data: [calificaciones['Muy bueno']]
            },
            {
              label: 'Buenas',
              backgroundColor: 'yellow',
              data: [calificaciones['Bueno']]
            },
            {
              label: 'Malas',
              backgroundColor: 'orange',
              data: [calificaciones['Malo']]
            },
            {
              label: 'Muy malas',
              backgroundColor: 'red',
              data: [calificaciones['Muy malo']]
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
    );
  }
}
