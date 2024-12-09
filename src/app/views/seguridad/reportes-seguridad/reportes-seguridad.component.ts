import { Component, OnInit } from '@angular/core';
import { CNavBarComponent } from '../../../components/c-nav-bar/c-nav-bar.component';
import { ApiService } from '../../../service/api.service';
import { NgFor } from '@angular/common';
import { DatePipe } from '@angular/common';
import { FormControl, FormGroup } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';
import { CalendarModule } from 'primeng/calendar';

@Component({
  selector: 'app-reportes-seguridad',
  standalone: true,
  imports: [CNavBarComponent, NgFor, DatePipe, ReactiveFormsModule, CalendarModule],
  templateUrl: './reportes-seguridad.component.html',
  styleUrl: './reportes-seguridad.component.css'
})
export class ReportesSeguridadComponent implements OnInit{
  reportes:any[]=[]
  fechas: Date[] = []
  filtroForm:FormGroup
  constructor(private apiService:ApiService){
    this.filtroForm = new FormGroup({
      categoria:new FormControl(''),
      fechas: new FormControl(null) 
    })
  }

  ngOnInit(): void {
    this.apiService.reportes_seguridad().subscribe(
      data =>{
        this.reportes = data.reportes
        console.log(this.reportes)

      }
    )
  }

  filtrar(){
    const fechas = this.fechas ? this.fechas.map(date => date.toISOString().split('T')[0]) : [];
    if(this.filtroForm.valid || fechas.length === 2){
      console.log('Formulario valido para fechas seleccionadas')
      const filtro = {...this.filtroForm.value};
      filtro.fechas = fechas

      console.log('Datos a enviar', filtro)
      this.apiService.filtrar_reporte_seguridad(filtro).subscribe(
        data => {
          this.reportes = data.reportes
        }
      )
    }
  }

  logFecha(event: any) {
    console.log('Fecha seleccionada:', event);
    console.log('rangeDates:', this.fechas);
  }

}
