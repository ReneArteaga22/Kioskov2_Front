import { Component } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-c-formulario-soporte-rh',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './c-formulario-soporte-rh.component.html',
  styleUrl: './c-formulario-soporte-rh.component.css'
})
export class CFormularioSoporteRhComponent {

  soporterhForm: FormGroup

  constructor(){
    this.soporterhForm = new FormGroup({
      folio: new FormControl(''),
      num_empleado: new FormControl(''),
      grupo: new FormControl(''),
      planta: new FormControl(''),
      nombre: new FormControl(''),
      telefono: new FormControl(''),
      reporte: new FormControl('')
    })
  }

  enviar(){
    console.log('Si ves esto, el formulario funciona', this.soporterhForm.value)
  }

}
