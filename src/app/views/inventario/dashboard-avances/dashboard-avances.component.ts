import { Component, OnInit, OnDestroy } from '@angular/core';
import { ApiService } from '../../../service/api.service';
import { ProgressBarModule } from 'primeng/progressbar';
import { CardModule } from 'primeng/card';
import { CommonModule } from '@angular/common';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { CNavBarComponent } from '../../../components/c-nav-bar/c-nav-bar.component'; 
import { CCardsModulesComponent } from '../../../components/c-cards-modules/c-cards-modules.component'; 
import { RouterLink } from '@angular/router';
import { DialogModule } from 'primeng/dialog';

@Component({
  selector: 'app-dashboard-avances',
  standalone: true,
  imports: [
    CNavBarComponent, 
    CCardsModulesComponent,
    CommonModule,
    ProgressBarModule,
    CardModule,
    ProgressSpinnerModule, 
    RouterLink, 
    DialogModule
  ],
  templateUrl: './dashboard-avances.component.html',
  styleUrls: ['./dashboard-avances.component.css']
})
export class DashboardAvancesComponent implements OnInit, OnDestroy {
  avances: any[] = [];
  loading = true;
  closeSession: boolean = false;
  private intervalId: any;

  constructor(private apiService: ApiService) {}

  ngOnInit(): void {
    this.cargarAvances(); 

   
    this.intervalId = setInterval(() => {
      this.cargarAvances();
    }, 60000); 
  }

  ngOnDestroy(): void {
    
    if (this.intervalId) {
      clearInterval(this.intervalId);
    }
  }

  cargarAvances(): void {
    this.loading = true;

    this.apiService.dashboard_avances().subscribe({
      next: (response) => {
        this.avances = response.avances;
        this.loading = false;
        const promedio = this.getPromedioAvance();
        console.log('✅ Promedio de avance:', promedio + '%');
      },
      error: (error) => {
        console.error('❌ Error al obtener avances:', error);
        this.loading = false;
      }
    });
  }

  getProgressBarClass(porcentaje: number): string {
    if (porcentaje <= 25) return 'progress-red';
    if (porcentaje <= 50) return 'progress-orange';
    if (porcentaje <= 75) return 'progress-yellow';
    if (porcentaje <= 99) return 'progress-green';
    return 'progress-blue';
  }

  getProgressClass(porcentaje: number): string {
    if (porcentaje <= 25) return 'progress-red';
    if (porcentaje <= 50) return 'progress-orange';
    if (porcentaje <= 75) return 'progress-yellow';
    if (porcentaje <= 99) return 'progress-green';
    return 'progress-blue';
  }

  getPromedioAvance(): number {
    const avancesValidos = this.avances
      .map(avance => Number(avance.porcentajeAvance))
      .filter(p => !isNaN(p));

    if (avancesValidos.length === 0) return 0;

    const suma = avancesValidos.reduce((total, p) => total + p, 0);
    const promedio = suma / avancesValidos.length;

    return Math.round(promedio);
  }
}
