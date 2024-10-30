import { Component, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { ApiService } from '../../service/api.service';
import { NgFor } from '@angular/common';

@Component({
  selector: 'app-comunicados',
  standalone: true,
  imports: [RouterLink, NgFor],
  templateUrl: './comunicados.component.html',
  styleUrl: './comunicados.component.css'
})
export class ComunicadosComponent implements OnInit{
  comunicados:any[] = []

  constructor(private apiService: ApiService){}

  ngOnInit(): void {
    this.apiService.comunicados().subscribe(
      response =>{
        this.comunicados = response.comunicados
        console.log(this.comunicados)
      }
    )
  }

}
