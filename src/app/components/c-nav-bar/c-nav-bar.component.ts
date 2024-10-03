import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-c-nav-bar',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './c-nav-bar.component.html',
  styleUrl: './c-nav-bar.component.css'
})
export class CNavBarComponent {
  isLoggedIn = true
}
