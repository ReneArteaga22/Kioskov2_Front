import { Component, OnInit } from '@angular/core';
import { CNavBarComponent } from '../../../components/c-nav-bar/c-nav-bar.component';
import { ChartModule } from 'primeng/chart';
import { ApiService } from '../../../service/api.service';
import { NgFor } from '@angular/common';
import { DatePipe } from '@angular/common';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';
import { DialogModule } from 'primeng/dialog';
import { ButtonModule } from 'primeng/button';
import { PaginatorModule } from 'primeng/paginator';
import { CalendarModule } from 'primeng/calendar';

@Component({
  selector: 'app-resultados-evaluacion',
  standalone: true,
  imports: [CNavBarComponent, ChartModule, NgFor, DatePipe, ReactiveFormsModule, DialogModule, ButtonModule, PaginatorModule, CalendarModule],
  templateUrl: './resultados-evaluacion.component.html',
  styleUrls: ['./resultados-evaluacion.component.css']
})
export class ResultadosEvaluacionComponent implements OnInit { 
  fechas: Date[] = [];
  visible: boolean = false;
  basicData: any;
  basicOptions: any;
  evaluaciones: any[] = [];
  filtrarForm: FormGroup;
  isSubmit: boolean = false;
  comentario: string = '';
  paginacionEvaluaciones: any[] = [];
  first: number = 0;
  rows: number = 15;
  totalRecords: any;

  constructor(private apiService: ApiService) {
    this.filtrarForm = new FormGroup({
      calificacion: new FormControl(''),
      planta: new FormControl('', [Validators.required]),
      fechas: new FormControl(null)  // Agrega el campo de fecha
    });
  }

  ngOnInit(): void {
    this.apiService.resultados_evaluacion_comedor().subscribe(
      response => {
        this.evaluaciones = response.evaluaciones;
        this.totalRecords = this.evaluaciones.length;
        this.paginateUsuarios();
        this.configurarGrafica();
        
      },
      error => {
        console.error('Error al obtener las evaluaciones', error);
      }
    );
  }

  paginateUsuarios() {
    this.paginacionEvaluaciones = this.evaluaciones.slice(this.first, this.first + this.rows);
  }

  onPageChange(event: any) {
    this.first = event.first;
    this.rows = event.rows;
    this.paginateUsuarios();
  }

  filtrar() {
    const fechas = this.fechas ? this.fechas.map(date => date.toISOString().split('T')[0]) : [];
    if (this.filtrarForm.valid || fechas.length === 2) {
      console.log('Formulario válido o fechas seleccionadas, enviando datos...'); // Verifica que esto se imprime
      const filtro = { ...this.filtrarForm.value };
      filtro.fechas = fechas;
  
      console.log('Datos a enviar:', filtro); // Verifica los datos que se envían
  
      this.apiService.filtrar_resultados_comedor(filtro).subscribe(
        response => {
          console.log('Respuesta del servidor:', response); // Verifica la respuesta del servidor
          this.evaluaciones = response.filtro;
          this.totalRecords = this.evaluaciones.length;
          this.paginateUsuarios();
        },
        error => {
          console.error('Error al filtrar las evaluaciones', error);
        }
      );
    } else {
      console.log('Formulario no válido y fechas no seleccionadas'); // Verifica si el formulario es inválido y no hay fechas
    }
  }

  logFecha(event: any) {
    console.log('Fecha seleccionada:', event);
    console.log('rangeDates:', this.fechas); // Verifica el contenido de rangeDates
  }
  
  
  mostrarComentario(id: number) {
    this.apiService.mostar_comentario_x_id(id).subscribe(
      response => {
        this.comentario = response.comentario.comentario;
        this.visible = true;
        console.log(response);
      },
      error => {
        console.error('Error al mostrar el comentario', error);
      }
    );
    console.log(id, typeof id);
  }

  configurarGrafica() {
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
        { label: 'Muy buenas', backgroundColor: 'green', data: [calificaciones['Muy bueno']] },
        { label: 'Buenas', backgroundColor: 'yellow', data: [calificaciones['Bueno']] },
        { label: 'Malas', backgroundColor: 'orange', data: [calificaciones['Malo']] },
        { label: 'Muy malas', backgroundColor: 'red', data: [calificaciones['Muy malo']] }
      ]
    };

    this.basicOptions = {
      responsive: true,
      maintainAspectRatio: false,
      scales: {
        xAxes: [{ barPercentage: 0.5, categoryPercentage: 0.5 }]
      }
    };
  }
}
