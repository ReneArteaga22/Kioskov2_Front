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
import { ToastModule } from 'primeng/toast';
import { NgIf } from '@angular/common';
import { HttpClient } from '@angular/common/http';



@Component({
  selector: 'app-comunicados',
  standalone: true,
  imports: [RouterLink, NgFor, DatePipe, PaginatorModule, DialogModule, CBarComponent, ReactiveFormsModule, FileUploadModule, NgIf, ToastModule],
  templateUrl: './comunicados.component.html',
  styleUrl: './comunicados.component.css',
  providers: [MessageService]
})
export class ComunicadosComponent implements OnInit {
  uploadedFiles: any[] = [];
  displayToast: boolean = false;
  toastMessage: string = '';
  toastSeverity: string = '';
  comunicadoForm: FormGroup
  visible: boolean = false
  visibleForm: boolean = false
  comunicados: any[] = []
  first: number = 0;
  totalRecords: any;
  rows: number = 6;
  paginacionComunicados: any[] = []
  isSubmit: boolean = false
  modal: boolean = false

  constructor(private apiService: ApiService, private cookie: CookieService, private messageService: MessageService,
    private http: HttpClient) {
    this.comunicadoForm = new FormGroup({
      imagen: new FormControl('', [Validators.required]),
      nombre: new FormControl('', Validators.required),
      fecha: new FormControl('', [Validators.required])
    })
  }

  ngOnInit(): void {
    this.apiService.comunicados().subscribe(
      response => {
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

  dialog(id: any) {
    this.visible = true
    this.cookie.set('comunicado', id)
    console.log(id)
  }
  cancelar() {
    this.visible = false
  }

  agregar() {
    this.visibleForm = true
  }

  agregar_comunicado() {
    console.log(this.comunicadoForm.value)
    // if(this.comunicadoForm.valid && !this.isSubmit){
    //   this.apiService.agregar_comunicado(this.comunicadoForm.value).subscribe(
    //     response=>{
    //       console.log(response)

    //     }
    //   )
    // }
    this.visibleForm = false
  }
  onUpload(event: any) {
    for (let file of event.files) {
        this.uploadedFiles.push(file);
        const formData = new FormData();
        const currentDate = new Date().toISOString();
        formData.append('imagen', file, file.name);
        formData.append('nombre', file.name);
        formData.append('fecha', currentDate);

        // Reemplaza 'YOUR_API_URL' con la URL de tu API de AdonisJS
        this.http.post('http://localhost:3333/api/comunicado/agregar_comunicado', formData).subscribe(
            (response) => {
                this.showToast('success', '¡Imagen subida con éxito!');
            },
            (error) => {
                this.showToast('error', '¡La subida de la imagen falló!');
            }
        );
    }
}

showToast(severity: string, message: string) {
    this.toastSeverity = severity;
    this.toastMessage = message;
    this.displayToast = true;

    // Ocultar el toast después de 3 segundos
    setTimeout(() => {
        this.displayToast = false;
    }, 3000);
}
  eliminar() {
    let comunicado = parseInt(this.cookie.get('comunicado'))
    console.log('eliminar', comunicado)
    this.apiService.eliminar_comunicado(comunicado).subscribe(
      response => {
        console.log('eliminar: ', response)
        this.visible = false
        location.reload()
      }
    )
  }

  alert() {
    this.modal = true
    setTimeout(() => {
      this.modal = false
      location.reload()
    }, 1600);

  }
}
