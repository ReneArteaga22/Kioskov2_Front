import { Component, OnInit } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { CookieService } from 'ngx-cookie-service';
import { NgIf } from '@angular/common';
import { DialogModule } from 'primeng/dialog';
import { CarouselModule } from 'primeng/carousel';

@Component({
  selector: 'app-c-nav-bar',
  standalone: true,
  imports: [RouterLink, NgIf, DialogModule, CarouselModule],
  templateUrl: './c-nav-bar.component.html',
  styleUrl: './c-nav-bar.component.css'
})
export class CNavBarComponent implements OnInit{
  isSistemas: boolean = false;
  isRH: boolean = false;
  isComedor: boolean = false
  isLoggin: boolean = false;
  visible:boolean = false
  closeSession:boolean = false
  images:any[]=[]

  constructor(private galleta:CookieService, private router:Router){}
  
  // verificar la sesion iniciada y mostrar sus modulos correspondientes
  ngOnInit(): void {
    const area = this.galleta.get('area')
    if(area === 'sistemas'){
      this.isSistemas = true
    }
    if(area === 'rh'){
      this.isRH = true
    }
    if(area === 'comedor_1' || area === 'comedor_2'){
      this.isComedor = true
    }
    this.isLoggin = this.galleta.check('sesion')
  }

  cerrarSesion(){
    this.galleta.deleteAll('/')
    this.isSistemas = false
    this.isLoggin = false
    this.isRH = false
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
 