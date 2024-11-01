import { Component } from '@angular/core';
import { CBarComponent } from '../../components/c-bar/c-bar.component';

@Component({
  selector: 'app-directorio',
  standalone: true,
  imports: [CBarComponent],
  templateUrl: './directorio.component.html',
  styleUrl: './directorio.component.css'
})
export class DirectorioComponent {

}
