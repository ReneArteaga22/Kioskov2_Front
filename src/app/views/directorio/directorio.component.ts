import { Component, OnInit } from '@angular/core';
import { CNavBarComponent } from '../../components/c-nav-bar/c-nav-bar.component';
import { OrganizationChartModule } from 'primeng/organizationchart';
import { TreeNode } from 'primeng/api';
import { EmployeeService } from '../../services/employee.service';
import { NgFor } from '@angular/common';
import { ApiService } from '../../service/api.service';


@Component({
  selector: 'app-directorio',
  standalone: true,
  imports: [CNavBarComponent, OrganizationChartModule, NgFor],
  templateUrl: './directorio.component.html',
  styleUrl: './directorio.component.css'
})
export class DirectorioComponent{

  constructor(){}

  data:TreeNode[]=[{
    label:'Slowbro',
    expanded:true,
    data:{
      image:'icons/slowbro.jpg'
    },
    children:[
      {
        label:'Gendar',
        expanded:true,
        data:{
          image:'icons/gengar.jpg'
        }
      },
      
    ]
  }]

  // data: TreeNode[] = [
  //   {
  //     label: 'Slowbro',
  //     expanded: true,
  //     data: {
  //       imageUrl: 'icons/slowbro.jpg' 
  //     },
      
  //     children: [
  //       {
  //         label: 'Gengar',
  //         expanded: true,
  //         data: {
  //           imageUrl: 'icons/gengar.jpg'
  //         },
  //         children: [
  //           {
  //             label: 'Mimikyu',
  //             data: {
  //               imageUrl: 'icons/mimikyu.png'
  //             }
  //           },
  //           {
  //             label: 'Ditto',
  //             data: {
  //               imageUrl: 'icons/ditto.jpg'
  //             }
  //           }
  //         ]
  //       },
  //       {
  //         label: 'Cubone',
  //         expanded: true,
  //         data: {imageUrl: 'icons/cubone.jpg' },
  //         children: [
  //           {
  //             label: 'Koffing',
  //             data: {imageUrl: 'icons/koffing.png' }
  //           },
  //           {
  //             label: 'Cubony',
  //             data: {imageUrl: 'icons/cubony.jpg' }
  //           }
  //         ]
  //       }
  //     ]
  //   }
  // ]

  hola(){
    alert('hola');
  }

}
