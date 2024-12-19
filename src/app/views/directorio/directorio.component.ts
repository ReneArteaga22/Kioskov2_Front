import { Component, OnInit } from '@angular/core';
import { CNavBarComponent } from '../../components/c-nav-bar/c-nav-bar.component';
import { OrganizationChartModule } from 'primeng/organizationchart';
import { EmployeeService } from '../../services/employee.service';
import { NgFor } from '@angular/common';

@Component({
  selector: 'app-directorio',
  standalone: true,
  imports: [CNavBarComponent, OrganizationChartModule, NgFor],
  templateUrl: './directorio.component.html',
  styleUrl: './directorio.component.css'
})
export class DirectorioComponent implements OnInit{
  usuarios:any[]=[]

  constructor(private apiService:EmployeeService){}

  hola(){
    alert('hola');
  }

  ngOnInit(): void {
    this.apiService.getEmployees().subscribe(
      response =>{
        this.usuarios = response
        console.log(response)
      }
    )
  }
}
