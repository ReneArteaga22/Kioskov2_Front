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
<<<<<<< HEAD

=======
>>>>>>> 990a6dd7576fb0e23603b381691a115ba9ecdfb0
  data: TreeNode[] = [
    {
      label: 'Luis Garcia',
      expanded: true,
      data:{
<<<<<<< HEAD
        image:'icons/lock.png'
=======
        image:'icons/user.png'
>>>>>>> 990a6dd7576fb0e23603b381691a115ba9ecdfb0
      },
      children: [
        {
          label: 'Rene Arteaga ',
          expanded: true,
          data:{
<<<<<<< HEAD
            image:'icons/lock.png'
=======
            image:'icons/user.png'
>>>>>>> 990a6dd7576fb0e23603b381691a115ba9ecdfb0
          },
          children: [
            {
              label: 'Victoria Blanco',
              data:{
<<<<<<< HEAD
                image:'icons/lock.png'
=======
                image:'icons/user.png'
>>>>>>> 990a6dd7576fb0e23603b381691a115ba9ecdfb0
              }
            },
            {
              label: 'Viktor Miller',
              data:{
<<<<<<< HEAD
                image:'icons/lock.png'
=======
                image:'icons/user.png'
>>>>>>> 990a6dd7576fb0e23603b381691a115ba9ecdfb0
              }
            }
          ]
        },
        {
          label: 'France',
          expanded: true,
          data: {
<<<<<<< HEAD
            image:'icons/lock.png'
=======
            image:'icons/user.png'
>>>>>>> 990a6dd7576fb0e23603b381691a115ba9ecdfb0
          },
          children: [
            {
              label: 'France',
              data: {
<<<<<<< HEAD
                image:'icons/lock.png'
=======
                image:'icons/user.png'
>>>>>>> 990a6dd7576fb0e23603b381691a115ba9ecdfb0
              }
            },
            {
              label: 'Morocco',
              data:{
<<<<<<< HEAD
                image:'icons/lock.png'
=======
                image:'icons/user.png'
>>>>>>> 990a6dd7576fb0e23603b381691a115ba9ecdfb0
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
