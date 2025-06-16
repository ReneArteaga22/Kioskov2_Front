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

//  getProgressBarStyle(porcentaje: number): any {
//   // Definimos solo el color de la barra de progreso
//   let progressColor;
  
//   if (porcentaje <= 25) {
//     progressColor = '#FF5252'; // Rojo
//   } else if (porcentaje <= 50) {
//     progressColor = '#FFA000'; // Ámbar/naranja
//   } else if (porcentaje <= 75) {
//     progressColor = '#FFC107'; // Amarillo
//   } else {
//     progressColor = '#4CAF50'; // Verde
//   }

//   return {
//     '--progress-color': progressColor,
//     '--background-color': '#e9ecef' // Gris claro
//   };
// }
getProgressBarClass(porcentaje: number): string {
  if (porcentaje <= 25) return 'progress-red';
  if (porcentaje <= 50) return 'progress-orange';
  if (porcentaje <= 75) return 'progress-yellow';
  return 'progress-green';
}
}