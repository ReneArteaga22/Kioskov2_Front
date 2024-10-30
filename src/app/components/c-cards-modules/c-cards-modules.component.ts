import { Component, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { CookieService } from 'ngx-cookie-service';
import { NgIf } from '@angular/common';

@Component({
  selector: 'app-c-cards-modules',
  standalone: true,
  imports: [RouterLink, NgIf],
  templateUrl: './c-cards-modules.component.html',
  styleUrl: './c-cards-modules.component.css'
})
export class CCardsModulesComponent implements OnInit{
  isRH:boolean = false
  isSistemas:boolean = false
  isComedor:boolean = false
  isLoggin:boolean = false

  constructor(private cookie:CookieService){}

  // verificar la sesion iniciada y mostrar sus modulos correspondientes
  ngOnInit(): void {
    const area = this.cookie.get('area')
    if(area === 'rh'){
      this.isRH = true
    }
    if(area === 'comedor_1' || area === 'comedor_2'){
      this.isComedor = true
    }
    if(area === 'sistemas'){
      this.isSistemas = true
    }

    this.isLoggin = this.cookie.check('sesion')
  }
}
