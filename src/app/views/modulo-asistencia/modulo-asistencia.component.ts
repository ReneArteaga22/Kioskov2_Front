import { Component, OnInit } from '@angular/core';
import { CNavBarComponent } from '../../components/c-nav-bar/c-nav-bar.component';
import { EmployeeService } from '../../services/employee.service';
import { NgIf } from '@angular/common';
import { NgFor } from '@angular/common';

@Component({
  selector: 'app-modulo-asistencia',
  standalone: true,
  imports: [CNavBarComponent, NgIf, NgFor],
  templateUrl: './modulo-asistencia.component.html',
  styleUrl: './modulo-asistencia.component.css'
})
export class ModuloAsistenciaComponent implements OnInit {

  employees: any[] = [];

  constructor(private EmployeeService: EmployeeService){}

  ngOnInit(): void {
    this.EmployeeService.getEmployees()
      .subscribe((data) => {this.employees = data},
      (error)=> {
        console.error('Error al obtener empleados:', error);
      }
    ); 
  }
  

}
