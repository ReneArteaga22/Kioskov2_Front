import { Component, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { ApiService } from '../../service/api.service';
import { NgFor } from '@angular/common';
import { DatePipe } from '@angular/common';
import { PaginatorModule } from 'primeng/paginator';
import { DialogModule } from 'primeng/dialog';
import { CookieService } from 'ngx-cookie-service';
import { CBarComponent } from '../../components/c-bar/c-bar.component';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-comunicados',
  standalone: true,
  imports: [RouterLink, NgFor, DatePipe, PaginatorModule,DialogModule,CBarComponent, ReactiveFormsModule],
  templateUrl: './comunicados.component.html',
  styleUrl: './comunicados.component.css'
})
export class ComunicadosComponent implements OnInit{

  comunicadoForm: FormGroup
  visible:boolean = false
  visibleForm:boolean = false
  comunicados: any[] = []
  first: number = 0;
  totalRecords: any;
  rows: number = 6;
  paginacionComunicados: any[]=[]
  isSubmit:boolean = false
  modal:boolean = false

  constructor(private apiService:ApiService, private cookie:CookieService){
    this.comunicadoForm = new FormGroup({
      imagen: new FormControl('',[Validators.required]),
      nombre: new FormControl('',Validators.required),
      fecha: new FormControl('',[Validators.required])
    })
  }

  ngOnInit(): void {
    this.apiService.comunicados().subscribe(
      response=>{
        this.comunicados = response.comunicados;
        this.totalRecords = this.comunicados.length;
        this.paginateComunicados()
        console.log(this.comunicados)
      }
    )
  }
  paginateComunicados() {
    this.paginacionComunicados = this.comunicados.slice(this.first, this.first + this.rows);
  }

  onPageChange(event: any) {
    this.first = event.first;
    this.rows = event.rows;
    this.paginateComunicados();
  }

  dialog(id:any){
    this.visible = true
    this.cookie.set('comunicado',id)
    console.log(id)
  }
  cancelar(){
    this.visible = false
  }

  agregar(){
    this.visibleForm = true
  }

  agregar_comunicado(){
    if(this.comunicadoForm.valid && !this.isSubmit){
      this.apiService.agregar_comunicado(this.comunicadoForm.value).subscribe(
        response=>{
          console.log(response)
        }
      )
    }
    this.visibleForm = false
  }

  eliminar(){
    let comunicado = parseInt(this.cookie.get('comunicado'))
    console.log('eliminar',comunicado)
    this.apiService.eliminar_comunicado(comunicado).subscribe(
      response=>{
        console.log('eliminar: ',response)
        this.visible = false
        location.reload()
      }
    )
  }

  alert(){
    this.modal = true
    setTimeout(() => { 
      this.modal = false
      location.reload()
    }, 1600);

  }
}
