import { Component, OnInit } from '@angular/core';
import { ApiService } from '../../../service/api.service';
import { ProgressBarModule } from 'primeng/progressbar';
import { CardModule } from 'primeng/card';
import { CommonModule } from '@angular/common';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { CNavBarComponent } from '../../../components/c-nav-bar/c-nav-bar.component'; 
import { CCardsModulesComponent } from '../../../components/c-cards-modules/c-cards-modules.component'; 

@Component({
  selector: 'app-dashboard-avances',
  standalone: true,
  imports: [
    CNavBarComponent, 
    CCardsModulesComponent,
    CommonModule,
    ProgressBarModule,
    CardModule,
    ProgressSpinnerModule
  ],
  templateUrl: './dashboard-avances.component.html',
  styleUrls: ['./dashboard-avances.component.css']
})
export class DashboardAvancesComponent implements OnInit {
  avances: any[] = [];
  loading = true;

  constructor(private apiService: ApiService) {}

  ngOnInit(): void {
    this.apiService.dashboard_avances().subscribe({
      next: (response) => {
        this.avances = response.avances;
        this.loading = false;
      },
      error: (error) => {
        console.error('Error al obtener avances:', error);
        this.loading = false;
      }
    });
  }

  getProgressColor(porcentaje: number): any {
   let backgroundColor, progressColor;
    
    if (porcentaje <= 25) {
      backgroundColor = '#FFEBEE'; // Fondo rojo claro
      progressColor = '#FF5252';   // Barra roja
    } else if (porcentaje <= 50) {
      backgroundColor = '#FFF8E1'; // Fondo amarillo claro
      progressColor = '#FFD740';   // Barra amarilla
    } else if (porcentaje <= 75) {
      backgroundColor = '#E3F2FD'; // Fondo azul claro
      progressColor = '#64B5F6';   // Barra azul
    } else {
      backgroundColor = '#E8F5E9'; // Fondo verde claro
      progressColor = '#4CAF50';    // Barra verde
    }

    return {
      'background-color': backgroundColor,
      '--progress-color': progressColor
    };
  }
}