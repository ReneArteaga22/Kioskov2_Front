import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { NgIf } from '@angular/common';

@Component({
  selector: 'app-soporte-rh',
  standalone: true,
  imports: [RouterLink, ButtonModule, NgIf],
  templateUrl: './soporte-rh.component.html',
  styleUrl: './soporte-rh.component.css'
})
export class SoporteRhComponent {

}
