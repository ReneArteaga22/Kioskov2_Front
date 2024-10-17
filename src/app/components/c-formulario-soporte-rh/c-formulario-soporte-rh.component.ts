import { Component } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';
import { ApiService } from '../../service/api.service';
import { CookieService } from 'ngx-cookie-service';

@Component({
  selector: 'app-c-formulario-soporte-rh',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './c-formulario-soporte-rh.component.html',
  styleUrl: './c-formulario-soporte-rh.component.css'
})
export class CFormularioSoporteRhComponent {

  isSubmit: boolean = false

  soporterhForm: FormGroup

  constructor(private apiService:ApiService, private cookie:CookieService){
    this.soporterhForm = new FormGroup({
      folio: new FormControl(''),
      no_empleado: new FormControl(''),
      grupo: new FormControl(''),
      nombre: new FormControl(''),
      descripcion: new FormControl(''),
      planta: new FormControl(''),
      telefono: new FormControl(''),
    })
  }

  enviar(){
    console.log(this.soporterhForm.value)
    const categoria = this.cookie.get('categoria')
    if(this.soporterhForm.valid && !this.isSubmit){
      this.apiService.crear_reporte(categoria, this.soporterhForm.value).subscribe(
        response =>{
          console.log(response)
          this.cookie.delete('categoria')
        }
      )
    }
  }
}
