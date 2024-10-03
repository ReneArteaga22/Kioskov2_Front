import { Component } from '@angular/core';
import { FormControl, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';

@Component({
  selector: 'app-transporte',
  standalone: true,
  imports: [RouterLink, ReactiveFormsModule],
  templateUrl: './transporte.component.html',
  styleUrl: './transporte.component.css'
})
export class TransporteComponent {
  transporteForm:FormGroup

  constructor(private router:Router){
    this.transporteForm = new FormGroup({
      calificacion: new FormControl('',[Validators.required])
    })
  }

  enviar(){
    alert('Encuesta enviada, gracias :D')
    this.router.navigate(['/servicios'])
  }

}
