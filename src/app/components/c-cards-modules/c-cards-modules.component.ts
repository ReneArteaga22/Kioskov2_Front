import { Component, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { CookieService } from 'ngx-cookie-service';
import { NgIf } from '@angular/common';
import { DialogModule } from 'primeng/dialog';
import { ButtonModule } from 'primeng/button';
import { CarouselModule } from 'primeng/carousel';
import { ApiService } from '../../service/api.service';

@Component({
  selector: 'app-c-cards-modules',
  standalone: true,
  imports: [RouterLink, NgIf, DialogModule, ButtonModule, CarouselModule],
  templateUrl: './c-cards-modules.component.html',
  styleUrls: ['./c-cards-modules.component.css'],
})
export class CCardsModulesComponent implements OnInit {
  isRH: boolean = false;
  isSistemas: boolean = false;
  isComedor: boolean = false;
  isLoggin: boolean = false;
  images: any[]=[];
  responsiveOptions: any[] | undefined;

  constructor(private cookie: CookieService, private apiService:ApiService) {}

  ngOnInit(): void {
    const area = this.cookie.get('area');
    if (area === 'rh') {
      this.isRH = true;
    }
    if (area === 'comedor_1' || area === 'comedor_2') {
      this.isComedor = true;
    }
    if (area === 'sistemas') {
      this.isSistemas = true;
    }

    
    
    this.isLoggin = this.cookie.check('sesion');
  }
}
