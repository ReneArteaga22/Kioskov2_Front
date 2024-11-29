import { Component, OnInit } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { CookieService } from 'ngx-cookie-service';
import { NgIf } from '@angular/common';
import { DialogModule } from 'primeng/dialog';
import { CarouselModule } from 'primeng/carousel';
import { ApiService } from '../../service/api.service';

@Component({
  selector: 'app-c-nav-bar',
  standalone: true,
  imports: [RouterLink, NgIf, DialogModule, CarouselModule],
  templateUrl: './c-nav-bar.component.html',
  styleUrl: './c-nav-bar.component.css'
})
export class CNavBarComponent implements OnInit{
  isSistemas: boolean = false;
  isSeguridad:boolean=false
  isRH: boolean = false;
  isComedor: boolean = false
  isLoggin: boolean = false;
  visible:boolean = false
  closeSession:boolean = false
  images:any[]=[]
  usuario:string = ''
  isSubmit:boolean = false

  constructor(private galleta:CookieService, private router:Router, private apiService:ApiService){}

  isMenuOpen = false; toggleMenu() { this.isMenuOpen = !this.isMenuOpen; }
  
  ngOnInit(): void {
    let id = this.galleta.get('user_num')

    this.apiService.usuario_x_id(id).subscribe(
      response=>{
        this.usuario = response.usuario.nombre
        console.log(this.usuario)
      },error =>{
        if(error.status === 400){
          console.log('No deberias estar viendo esto... 😑')
        }
      }
    )
    const area = this.galleta.get('area')

    // CONDICION DE SU ROL QUE MODULOS VA A VER
    if(area === 'sistemas'){
      this.isSistemas = true
    }
    if(area === 'rh'){
      this.isRH = true
    }
    if(area === 'comedor_1' || area === 'comedor_2'){
      this.isComedor = true
    }
    if(area === 'seguridad'){
      this.isSeguridad = true
    }
    this.isLoggin = this.galleta.check('sesion') 
  }

  cerrarSesion(){
    this.galleta.deleteAll('/')
    this.isSistemas = false
    this.isLoggin = false
    this.isRH = false
    this.isSeguridad = false
    this.closeSession = true

    setTimeout(()=>{
      this.router.navigate(['/'])
      this.closeSession = false
      location.reload()
    },1600)
  }

  navegar(event: any) {
    const selectedValue = event.target.value;
    if (selectedValue === '/login') {
      this.router.navigate(['/login'])
      this.isLoggin = false
      this.galleta.deleteAll()
    } else if (selectedValue) {
      this.router.navigate([selectedValue]);
    }
  }
  modal(){
    this.visible = true
  }
}
 