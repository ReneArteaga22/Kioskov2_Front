import { Component, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { ApiService } from '../../service/api.service';
import { DatePipe } from '@angular/common';
import { NgFor } from '@angular/common';
import { CNavBarComponent } from '../../components/c-nav-bar/c-nav-bar.component';
@Component({
  selector: 'app-sugerencias',
  standalone: true,
  imports: [RouterLink, DatePipe, NgFor ,CNavBarComponent],
  templateUrl: './sugerencias.component.html',
  styleUrl: './sugerencias.component.css'
})
export class SugerenciasComponent implements OnInit{
  sugerencias:any[] = []

  constructor(private apiService:ApiService){}

  ngOnInit(): void {
    this.apiService.sugerencias().subscribe(
      response =>{
        this.sugerencias = response.sugerencias
        console.log(this.sugerencias)
      }
    )
  }
}
