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
  isComedor1: boolean = false
  isComedor2: boolean = false

  isLoggin:boolean = false

  constructor(private cookie:CookieService){

  }
  ngOnInit(): void {
    const area = this.cookie.get('area')
    this.isRH = area === 'rh'
    this.isComedor1 = area === 'comedor_1'
    this.isComedor2 = area === 'comedor_2'

    this.isLoggin = this.cookie.check('sesion')
  }
}
