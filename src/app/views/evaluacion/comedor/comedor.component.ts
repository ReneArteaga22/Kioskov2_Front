import { Component } from '@angular/core';
import { FormControl, FormGroup, Validators,ReactiveFormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';

@Component({
  selector: 'app-comedor',
  standalone: true,
  imports: [RouterLink, ReactiveFormsModule],
  templateUrl: './comedor.component.html',
  styleUrl: './comedor.component.css'
})
export class ComedorComponent {
  comedorForm: FormGroup

  constructor(private router:Router){
    this.comedorForm = new FormGroup({
      calificacion: new FormControl('',[Validators.required])
    })
  }
  enviar(){
    alert('Gracias por comentar :D')
    this.router.navigate(['/servicios'])
  }
}
