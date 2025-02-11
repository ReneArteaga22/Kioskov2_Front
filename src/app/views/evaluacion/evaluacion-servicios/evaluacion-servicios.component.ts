import { Component, OnInit } from '@angular/core';
import { Router, RouterLink } from '@angular/router';

//importacion de componentes 
import { CNavBarComponent } from '../../../components/c-nav-bar/c-nav-bar.component';
import { CookieService } from 'ngx-cookie-service';
import { NgIf } from '@angular/common';
import { CFlechasComponent } from '../../../components/c-flechas/c-flechas.component';
@Component({
  selector: 'app-evaluacion-servicios',
  standalone: true,
  imports: [RouterLink, CNavBarComponent, NgIf, CFlechasComponent],
  templateUrl: './evaluacion-servicios.component.html',
  styleUrl: './evaluacion-servicios.component.css'
})
export class EvaluacionServiciosComponent implements OnInit {
  isRH: boolean = false
  isComedor1: boolean = false
  isComedor2: boolean = false

  isLoggin: boolean = false

  constructor(private router: Router, private cookie: CookieService) { }
  ngOnInit(): void {
    const area = this.cookie.get('area')
    this.isRH = area === 'rh'
    this.isComedor1 = area === 'comedor_1'
    this.isComedor2 = area === 'comedor_2'

    this.isLoggin = this.cookie.check('sesion')
  }
}
