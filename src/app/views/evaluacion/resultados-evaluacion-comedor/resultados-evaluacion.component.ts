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


@Component({
  selector: 'app-resultados-evaluacion',
  standalone: true,
  imports: [CNavBarComponent, ChartModule, NgFor, DatePipe, ReactiveFormsModule, DialogModule, ButtonModule],
  templateUrl: './resultados-evaluacion.component.html',
  styleUrl: './resultados-evaluacion.component.css'
})
export class ResultadosEvaluacionComponent implements OnInit {
  visible: boolean = false;
  basicData: any;
  basicOptions: any;
  evaluaciones: any[] = []
  filtrarForm: FormGroup
  isSubmit: boolean = false
  comentario: string = '';

  constructor(private apiService: ApiService) {
    this.filtrarForm = new FormGroup({
      calificacion: new FormControl('',[Validators.required]),
      planta: new FormControl('',[Validators.required])
    })
  }

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

  filtrar(){
    if(this.filtrarForm.valid && !this.isSubmit){
      this.apiService.filtrar_resultados_comedor(this.filtrarForm.value).subscribe(
        response =>{
          this.evaluaciones = response.filtro
          console.log(this.evaluaciones)
        }
      )
    }
  }

  mostrarComentario(id:number){
    this.apiService.mostar_comentario_x_id(id).subscribe(
      response =>{
        this.comentario = response.comentario.comentario
        this.visible = true
        console.log(response)
      }
    )
    console.log(id, typeof id)
  }



}
