import { Component, OnInit } from '@angular/core';
import { SidebarModule } from 'primeng/sidebar';
import { ButtonModule } from 'primeng/button';
import { Router, RouterLink } from '@angular/router';
import { RouterOutlet } from '@angular/router';
import { CardModule } from 'primeng/card';
import { CFlechasComponent } from '../../components/c-flechas/c-flechas.component';

//importando componentes 
import { CNavBarComponent } from '../../components/c-nav-bar/c-nav-bar.component';
import { CCardsModulesComponent } from '../../components/c-cards-modules/c-cards-modules.component';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [SidebarModule, ButtonModule, RouterLink, RouterOutlet, CardModule, CNavBarComponent, CCardsModulesComponent, CFlechasComponent ],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent{

}
