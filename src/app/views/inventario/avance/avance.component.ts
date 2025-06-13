import { Component } from '@angular/core';
import { SidebarModule } from 'primeng/sidebar';
import { ButtonModule } from 'primeng/button';
import { Router, RouterLink } from '@angular/router';
import { CardModule } from 'primeng/card';
import { CFlechasComponent } from '../../../components/c-flechas/c-flechas.component';

//importando componentes 
import { CNavBarComponent } from '../../../components/c-nav-bar/c-nav-bar.component'; 
import { CCardsModulesComponent } from '../../../components/c-cards-modules/c-cards-modules.component'; 


@Component({
  selector: 'app-avance',
  standalone: true,
  imports: [ RouterLink, CNavBarComponent, CFlechasComponent ],
  templateUrl: './avance.component.html',
  styleUrl: './avance.component.css'
})
export class AvanceComponent {

}
