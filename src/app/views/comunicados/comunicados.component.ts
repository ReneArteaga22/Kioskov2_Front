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
import { MessageService } from 'primeng/api';
import { FileUploadModule } from 'primeng/fileupload';
import { NgIf } from '@angular/common';



@Component({
  selector: 'app-comunicados',
  standalone: true,
  imports: [RouterLink, NgFor, DatePipe, PaginatorModule,DialogModule,CBarComponent, ReactiveFormsModule, FileUploadModule, NgIf],
  templateUrl: './comunicados.component.html',
  styleUrl: './comunicados.component.css',
  providers: [MessageService]
})
export class ComunicadosComponent implements OnInit{

  hoy:string = ''
  uploadedFiles: any[] = []
  comunicadoForm: FormGroup
  menuForm:FormGroup
  visible:boolean = false
  visibleForm:boolean = false
  comunicados: any[] = []
  first: number = 0;
  totalRecords: any;
  rows: number = 6;
  paginacionComunicados: any[]=[]
  isSubmit:boolean = false
  modal:boolean = false
  visibleFormMenu: boolean = false
  menus:any[]=[]

  constructor(private apiService:ApiService, private cookie:CookieService, private messageService: MessageService){

    const ahora = new Date();
    ahora.setHours(ahora.getHours() - 6); 
    this.hoy = ahora.toISOString().substring(0, 16)

    this.comunicadoForm = new FormGroup({
      imagen: new FormControl('',[Validators.required]),
      nombre: new FormControl('',[Validators.required]),
      tipo: new FormControl('comunicado')
    })

    this.menuForm = new FormGroup({
      imagen: new FormControl('',[Validators.required]),
      nombre: new FormControl('',[Validators.required]),
      tipo: new FormControl('menu')
    })
  }
  

  ngOnInit(): void {
    this.apiService.menu_comunicado().subscribe(
      response =>{
        this.menus = response.comunicado
        console.log('mira',this.menus)
      }
    )

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

  onUpload(event:any){ 
    for (let file of event.files)
      { this.uploadedFiles.push(file); this.comunicadoForm.patchValue({ imagen: file }) 
    } 
  }

  agregar(){
    this.visibleForm = true
  }

  agregarMenu(){
    this.visibleFormMenu = true
  }

  agregar_comunicado(){
    console.log(this.comunicadoForm.value)
    if(this.comunicadoForm.valid && !this.isSubmit){
      this.apiService.agregar_comunicado(this.comunicadoForm.value).subscribe(
        response=>{
          console.log(response)
        }
      )
    }
    this.visibleForm = false
  }

  agregar_menu(){
    console.log(this.menuForm.value)
    if(this.menuForm.valid && !this.isSubmit){
      this.apiService.agregar_comunicado(this.menuForm.value).subscribe(
        response=>{
          console.log(response)
        }
      )
    }
    this.visibleFormMenu = false
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

  onFileChange(event:any) 
  { const file = event.target.files[0]; 
  if (file){
      this.comunicadoForm.patchValue({ 
        imagen: file.name
      })
    } 
  }

  onFileChangeMenu(event:any) 
  { const file = event.target.files[0]; 
  if (file){
      this.menuForm.patchValue({ 
        imagen: file.name
      })
    } 
  }
}
