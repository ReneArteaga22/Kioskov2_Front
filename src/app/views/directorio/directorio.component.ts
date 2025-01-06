import { Component, OnInit } from '@angular/core';
import { CNavBarComponent } from '../../components/c-nav-bar/c-nav-bar.component';
import { OrganizationChartModule } from 'primeng/organizationchart';
import { EmployeeService } from '../../services/employee.service';
import { NgFor } from '@angular/common';
import { TreeNode } from 'primeng/api';

@Component({
  selector: 'app-directorio',
  standalone: true,
  imports: [CNavBarComponent, OrganizationChartModule, NgFor],
  templateUrl: './directorio.component.html',
  styleUrl: './directorio.component.css'
})
export class DirectorioComponent{
  data: TreeNode[] = [
    {
      label: 'Luis Garcia',
      expanded: true,
      data:{
        image:'icons/user.png'
      },
      children: [
        {
          label: 'Rene Arteaga ',
          expanded: true,
          data:{
            image:'icons/user.png'
          },
          children: [
            {
              label: 'Victoria Blanco',
              data:{
                image:'icons/user.png'
              }
            },
            {
              label: 'Viktor Miller',
              data:{
                image:'icons/user.png'
              }
            }
          ]
        },
        {
          label: 'France',
          expanded: true,
          data: {
            image:'icons/user.png'
          },
          children: [
            {
              label: 'France',
              data: {
                image:'icons/user.png'
              }
            },
            {
              label: 'Morocco',
              data:{
                image:'icons/user.png'
              }
            }
          ]
        }
      ]
    }
  ];

  constructor(private apiService: EmployeeService) {
  }

  hola() {
    alert('hola');
  }
}
