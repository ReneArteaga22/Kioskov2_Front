import { Component } from '@angular/core';
import { FormControl, FormGroup,ReactiveFormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { CNavBarComponent } from '../../../components/c-nav-bar/c-nav-bar.component';
import { ApiService } from '../../../service/api.service';
import { NgClass } from '@angular/common';
import { CookieService } from 'ngx-cookie-service';
import { DialogModule } from 'primeng/dialog';
import { NgIf } from '@angular/common';

@Component({
  selector: 'app-comedor',
  standalone: true,
  imports: [RouterLink, ReactiveFormsModule, CNavBarComponent, NgClass, DialogModule, NgIf],
  templateUrl: './comedor.component.html',
  styleUrl: './comedor.component.css'
})
export class ComedorComponent {
  visible: boolean = false;
  selectedOption: string | null = null;
  comedorForm: FormGroup
  isSubmit: boolean = false
  error:boolean= false
  

  constructor(private router:Router, private apiService:ApiService, private cookie:CookieService){
    this.comedorForm = new FormGroup({
      calificacion: new FormControl(''),
      comentario: new FormControl(''),
      planta: new FormControl(''),
      servicio: new FormControl('')
    })
  }

  ngOnInit() {
    const area = this.cookie.get('area');
    if (area === 'comedor_1') {
      this.comedorForm.patchValue({ planta: 'planta 1' });
    } else if (area === 'comedor_2') {
      this.comedorForm.patchValue({ planta: 'planta 2' });
    }
  }

  calificacion(calificacion: string, servicio: string) {
    this.selectedOption = calificacion;
    this.comedorForm.patchValue({ calificacion: calificacion, servicio:servicio });
  }

  enviar() {
    if (this.comedorForm.valid && !this.isSubmit) {
      this.apiService.evaluar_servicio(this.comedorForm.value).subscribe(
        response => {
          this.visible = true;
          setTimeout(() => {
            this.visible = false;
            this.comedorForm.reset(); 
            this.selectedOption = null;  
            this.router.navigateByUrl('/comedor', { skipLocationChange: true }).then(() => {
              this.router.navigate([this.router.url]);
            });
          }, 1600);
        },
        error => {
          if (error.status === 400) {
            this.error = true;
          }
        }
      )
    }
  }
}
