import { Component, OnInit } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { CookieService } from 'ngx-cookie-service';
import { NgIf } from '@angular/common';

@Component({
  selector: 'app-c-nav-bar',
  standalone: true,
  imports: [RouterLink, NgIf],
  templateUrl: './c-nav-bar.component.html',
  styleUrl: './c-nav-bar.component.css'
})
export class CNavBarComponent implements OnInit{
  isSistemas: boolean = false;
  isRH: boolean = false;
  isLoggin: boolean = false;


  constructor(private galleta:CookieService, private router:Router){}

  ngOnInit(): void {
    const area = this.galleta.get('area')
    this.isSistemas = area === 'sistemas'
    this.isRH = area === 'rh'
    this.isLoggin = this.galleta.check('sesion')//cookie que verifica si existe una sesion iniciada
  }

  cerrarSesion(){
    this.galleta.delete('sesion') 
    this.router.navigate(['/login'])
    this.isLoggin = false
    this.galleta.delete('area')
  }
}
 