import { Component, OnInit } from '@angular/core';
import { DialogModule } from 'primeng/dialog';
import { CarouselModule } from 'primeng/carousel';
import { ApiService } from '../../service/api.service';
import { CNavBarComponent } from '../../components/c-nav-bar/c-nav-bar.component';

@Component({
  selector: 'app-comunicado',
  standalone: true,
  imports: [CNavBarComponent, DialogModule, CarouselModule],
  templateUrl: './comunicado.component.html',
  styleUrls: ['./comunicado.component.css']
})
export class ComunicadoComponent implements OnInit {
  
  visible: boolean = false;
  images: any[] = [];

  // Estilos responsivos para el diálogo y el carrusel
  dialogStyle = {
    width: '50%',
    height: '100%'
  };


  constructor(private apiService: ApiService) {}

  ngOnInit(): void {
    this.apiService.comunicados().subscribe(
      response => {
        this.images = response.comunicados;
        console.log(this.images);
      }
    );
    this.visible = true;
  }
}
