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
import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';
import { CFlechasComponent } from '../../../components/c-flechas/c-flechas.component';


@Component({
  selector: 'app-resultados-evaluacion',
  standalone: true,
  imports: [CNavBarComponent, ChartModule, NgFor, DatePipe, ReactiveFormsModule, DialogModule, ButtonModule, PaginatorModule, CalendarModule, CFlechasComponent],
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
  rangeDates: Date[] | undefined
  planta1Data: any;
  planta2Data: any;
  combinedData: any;

  constructor(private apiService: ApiService) {
    this.filtrarForm = new FormGroup({
      calificacion: new FormControl(''),
      planta: new FormControl(''),
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

  obtenerEvaluaciones() {
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
          console.log('Respuesta del servidor:', response);
          this.evaluaciones = response.filtro;
          this.totalRecords = this.evaluaciones.length;
          this.paginateUsuarios();
          this.configurarGrafica();
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
    this.obtenerEvaluaciones();
    this.configurarGrafica();
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
    if (!this.evaluaciones.length) {
      this.basicData = {
        labels: ['Sin evaluaciones'],
        datasets: []
      };
      return;
    }
    const calificacionesPlanta1: { [key: string]: number } = { 'Muy bueno': 0, 'Bueno': 0, 'Malo': 0, 'Muy malo': 0 };
    const calificacionesPlanta2: { [key: string]: number } = { 'Muy bueno': 0, 'Bueno': 0, 'Malo': 0, 'Muy malo': 0 };
    const calificacionesTotales: { [key: string]: number } = { 'Muy bueno': 0, 'Bueno': 0, 'Malo': 0, 'Muy malo': 0 };

    
    this.evaluaciones.forEach(evaluacion => {
      const planta = evaluacion.planta;
      const calificacion = evaluacion.calificacion as keyof typeof calificacionesPlanta1;

      if (planta === 'planta 1' && calificacionesPlanta1[calificacion] !== undefined) {
        calificacionesPlanta1[calificacion]++;
      } else if (planta === 'planta 2' && calificacionesPlanta2[calificacion] !== undefined) {
        calificacionesPlanta2[calificacion]++;
      }

      if (calificacionesTotales[calificacion] !== undefined) {
        calificacionesTotales[calificacion]++;
      }
    });

    
    this.planta1Data = {
      labels: ['Evaluaciones Planta 1'],
      datasets: [
        { label: 'Muy buenas', backgroundColor: 'green', data: [calificacionesPlanta1['Muy bueno']] },
        { label: 'Buenas', backgroundColor: 'yellow', data: [calificacionesPlanta1['Bueno']] },
        { label: 'Malas', backgroundColor: 'orange', data: [calificacionesPlanta1['Malo']] },
        { label: 'Muy malas', backgroundColor: 'red', data: [calificacionesPlanta1['Muy malo']] }
      ]
    };

    
    this.planta2Data = {
      labels: ['Evaluaciones Planta 2'],
      datasets: [
        { label: 'Muy buenas', backgroundColor: 'green', data: [calificacionesPlanta2['Muy bueno']] },
        { label: 'Buenas', backgroundColor: 'yellow', data: [calificacionesPlanta2['Bueno']] },
        { label: 'Malas', backgroundColor: 'orange', data: [calificacionesPlanta2['Malo']] },
        { label: 'Muy malas', backgroundColor: 'red', data: [calificacionesPlanta2['Muy malo']] }
      ]
    };

    
    this.combinedData = {
      labels: ['Evaluaciones Generales'],
      datasets: [
        { label: 'Muy buenas', backgroundColor: 'green', data: [calificacionesTotales['Muy bueno']] },
        { label: 'Buenas', backgroundColor: 'yellow', data: [calificacionesTotales['Bueno']] },
        { label: 'Malas', backgroundColor: 'orange', data: [calificacionesTotales['Malo']] },
        { label: 'Muy malas', backgroundColor: 'red', data: [calificacionesTotales['Muy malo']] }
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
    this.saveAsExcelFile(excelBuffer, 'evaluaciones_comedor');
  }

  private saveAsExcelFile(buffer: any, fileName: string): void {
    const data: Blob = new Blob([buffer], { type: EXCEL_TYPE });
    saveAs(data, `${fileName}_export_${new Date().getTime()}.xlsx`);
  }
}

const EXCEL_TYPE = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8';