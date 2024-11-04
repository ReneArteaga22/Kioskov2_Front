import { Component, OnInit } from '@angular/core';
import { CBarComponent } from '../../components/c-bar/c-bar.component';
import { DialogModule } from 'primeng/dialog';
import { CarouselModule } from 'primeng/carousel';
import { ApiService } from '../../service/api.service';

@Component({
  selector: 'app-comunicado',
  standalone: true,
  imports: [CBarComponent, DialogModule, CarouselModule],
  templateUrl: './comunicado.component.html',
  styleUrl: './comunicado.component.css'
})
export class ComunicadoComponent  implements OnInit{

  constructor(private apiService:ApiService){}

  visible:boolean = false
  images: any[] = []

  ngOnInit(): void {
    this.apiService.comunicados().subscribe(
      response =>{
        this.images = response.comunicados
        console.log(this.images)
      }
    )
    this.visible = true
  }
}
