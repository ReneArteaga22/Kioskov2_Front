import { Component, OnInit } from '@angular/core';
import { SidebarModule } from 'primeng/sidebar';
import { ButtonModule } from 'primeng/button';
import { Router, RouterLink } from '@angular/router';
import { RouterOutlet } from '@angular/router';
import { CardModule } from 'primeng/card';

//importando componentes 
import { CNavBarComponent } from '../../components/c-nav-bar/c-nav-bar.component';
import { CCardsModulesComponent } from '../../components/c-cards-modules/c-cards-modules.component';
import { CookieService } from 'ngx-cookie-service';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [SidebarModule, ButtonModule, RouterLink, RouterOutlet, CardModule, CNavBarComponent, CCardsModulesComponent ],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent implements OnInit{
  constructor(private router:Router, private cookie:CookieService){

  }

  ngOnInit(): void {
    let area = this.cookie.get('area')
    if(area === 'comedor_1' || 'comedor_2'){
      this.router.navigate(['/comedor'])
    }
  }
}
