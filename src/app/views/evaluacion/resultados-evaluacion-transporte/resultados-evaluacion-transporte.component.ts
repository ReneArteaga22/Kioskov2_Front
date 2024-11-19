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
import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';

@Component({
  selector: 'app-resultados-evaluacion-transporte',
  standalone: true,
  imports: [CNavBarComponent, ChartModule, NgFor, DatePipe, ReactiveFormsModule, DialogModule, ButtonModule, PaginatorModule],
  templateUrl: './resultados-evaluacion-transporte.component.html',
  styleUrl: './resultados-evaluacion-transporte.component.css'
})
export class ResultadosEvaluacionTransporteComponent implements OnInit {
  comentario: string = '';
  visible: boolean = false;
  basicData: any;
  basicOptions: any;
  evaluaciones: any[] = []
  filtrarForm:FormGroup
  isSubmit: boolean = false
  paginacionEvaluaciones: any[] = [];
  first: number = 0;
  rows: number = 15;
  totalRecords: any;
  fechas: Date[] = [];


  constructor(private apiService:ApiService) {
    this.filtrarForm = new FormGroup({
      calificacion: new FormControl('',[Validators.required]),
    })}


  ngOnInit(): void {
    this.apiService.resultados_evaluacion_transporte().subscribe(
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

  obtenerEvaluaciones() {
    this.apiService.resultados_evaluacion_transporte().subscribe(
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
      console.log('Formulario válido o fechas seleccionadas, enviando datos...'); 
      const filtro = { ...this.filtrarForm.value };
      filtro.fechas = fechas;
  
      console.log('Datos a enviar:', filtro); 
  
      this.apiService.filtrar_resultados_transporte(filtro).subscribe(
        response => {
          console.log('Respuesta del servidor:', response); 
          this.evaluaciones = response.filtro;
          this.totalRecords = this.evaluaciones.length;
          this.paginateUsuarios();
        },
        error => {
          console.error('Error al filtrar las evaluaciones', error);
        }
      );
    } else {
      console.log('Formulario no válido y fechas no seleccionadas'); 
    }
  }
  
  clearFilters() {
    this.filtrarForm.reset();
    this.fechas = [];
    this.obtenerEvaluaciones();  // Lógica para obtener todos los registros sin filtro
  }

  logFecha(event: any) {
    console.log('Fecha seleccionada:', event);
    console.log('rangeDates:', this.fechas); 
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
  exportToExcel() {
    const ws: XLSX.WorkSheet = XLSX.utils.json_to_sheet(this.evaluaciones);
    const wb: XLSX.WorkBook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Evaluaciones');

    const excelBuffer: any = XLSX.write(wb, { bookType: 'xlsx', type: 'array' });
    this.saveAsExcelFile(excelBuffer, 'evaluaciones_transporte');
  }

  private saveAsExcelFile(buffer: any, fileName: string): void {
    const data: Blob = new Blob([buffer], { type: EXCEL_TYPE });
    saveAs(data, `${fileName}_export_${new Date().getTime()}.xlsx`);
  }
}
const EXCEL_TYPE = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8';

