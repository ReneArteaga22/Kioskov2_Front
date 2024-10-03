import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-soporte-rh',
  standalone: true,
  imports: [RouterLink, ButtonModule, RouterOutlet],
  templateUrl: './soporte-rh.component.html',
  styleUrl: './soporte-rh.component.css'
})
export class SoporteRhComponent {

}
