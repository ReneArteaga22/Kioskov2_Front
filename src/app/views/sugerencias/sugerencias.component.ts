import { Component, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { ApiService } from '../../service/api.service';
import { DatePipe } from '@angular/common';
import { NgFor } from '@angular/common';
import { CNavBarComponent } from '../../components/c-nav-bar/c-nav-bar.component';
import { CFlechasComponent } from '../../components/c-flechas/c-flechas.component';
import { PaginatorModule } from 'primeng/paginator';

@Component({
  selector: 'app-sugerencias',
  standalone: true,
  imports: [RouterLink, DatePipe, NgFor ,CNavBarComponent, CFlechasComponent, PaginatorModule],
  templateUrl: './sugerencias.component.html',
  styleUrl: './sugerencias.component.css'
})
export class SugerenciasComponent implements OnInit{
  sugerencias:any[] = []

  paginatedSugerencias: any[] = []
  first: number = 0
  rows: number = 7
  totalRecords: any

  constructor(private apiService:ApiService){}

  ngOnInit(): void {
    this.apiService.sugerencias().subscribe(
      response =>{
        this.sugerencias = response.sugerencias
        this.totalRecords = this.sugerencias.length
        this.paginateSugerencias()
      }
    )
  }

  paginateSugerencias() {
    this.paginatedSugerencias = this.sugerencias.slice(this.first, this.first + this.rows)
  }

  onPageChange(event:any) {
    this.first = event.first
    this.rows = event.rows
    this.paginateSugerencias()
  }
}
