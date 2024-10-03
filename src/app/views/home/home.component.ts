import { Component } from '@angular/core';
import { SidebarModule } from 'primeng/sidebar';
import { ButtonModule } from 'primeng/button';
import { RouterLink } from '@angular/router';
import { RouterOutlet } from '@angular/router';
import { CardModule } from 'primeng/card';

import { CNavBarComponent } from '../../components/c-nav-bar/c-nav-bar.component';
@Component({
  selector: 'app-home',
  standalone: true,
  imports: [SidebarModule, ButtonModule, RouterLink, RouterOutlet, CardModule, CNavBarComponent ],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent {

  click(){
    alert('hola jajajaj')
  }

}
