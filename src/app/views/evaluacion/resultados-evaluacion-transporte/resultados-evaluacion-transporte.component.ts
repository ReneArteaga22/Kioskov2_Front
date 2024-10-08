import { Component } from '@angular/core';
import { CNavBarComponent } from '../../../components/c-nav-bar/c-nav-bar.component';
import { ChartModule } from 'primeng/chart';

@Component({
  selector: 'app-resultados-evaluacion-transporte',
  standalone: true,
  imports: [CNavBarComponent, ChartModule],
  templateUrl: './resultados-evaluacion-transporte.component.html',
  styleUrl: './resultados-evaluacion-transporte.component.css'
})
export class ResultadosEvaluacionTransporteComponent {
  basicData: any;
  basicOptions: any;

  constructor() {
    this.basicData = {
      labels: ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo'],
      datasets: [
        {
          label: 'Ventas',
          backgroundColor: '#42A5F5',
          data: [65, 59, 80, 81, 56]
        },
        {
          label: 'Compras',
          backgroundColor: '#66BB6A',
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
}
