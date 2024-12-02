import { Component, OnInit } from '@angular/core'
import { DialogModule } from 'primeng/dialog'
import { CarouselModule } from 'primeng/carousel'
import { ApiService } from '../../service/api.service'
import { CNavBarComponent } from '../../components/c-nav-bar/c-nav-bar.component'

@Component({
  selector: 'app-comunicado',
  standalone: true,
  imports: [CNavBarComponent, DialogModule, CarouselModule],
  templateUrl: './comunicado.component.html',
  styleUrls: ['./comunicado.component.css']
})
export class ComunicadoComponent implements OnInit {
  
  visible: boolean = false
  images: any[] = []
  timer = 35000
  autoplayTimer: any

  // Estilos responsivos para el diálogo y el carrusel
  dialogStyle = {
    width: '55rem',
    height: '87rem'
  }

  carouselImageStyle = {
    width: '100%',
    height: '45rem'
  }

  carouselResponsiveOptions = [
    {
      breakpoint: '1199px',
      numVisible: 1,
      numScroll: 1
    },
    {
      breakpoint: '991px',
      numVisible: 1,
      numScroll: 1,
      style: { height: '40rem' } // Ajuste para tabletas
    },
    {
      breakpoint: '767px',
      numVisible: 1,
      numScroll: 1,
      style: { height: '35rem' } // Ajuste para móviles grandes
    },
    {
      breakpoint: '575px',
      numVisible: 1,
      numScroll: 1,
      style: { height: '25rem' } // Ajuste para móviles pequeños
    }
  ]

  constructor(private apiService: ApiService) {}

  ngOnInit(): void { 
    this.apiService.comunicados().subscribe( 
      response => { 
        this.images = response.comunicados
        console.log(this.images)
        this.startAutoplay() // Iniciar autoplay después de cargar las imágenes
      }, 
      error => { 
        console.error('Error al obtener los comunicados', error) 
      } 
    )
    setInterval(()=>{
      location.reload()
    },600000)
    this.visible = true 
    this.timer = 35000
  }

  startAutoplay() {
    this.stopAutoplay() // Para evitar múltiples timers
    this.autoplayTimer = setInterval(() => {
      // Aquí puedes implementar la lógica para avanzar el carrusel, por ejemplo, llamando a un método del carrusel para avanzar a la siguiente imagen.
      console.log('Autoplay avanzando...')
    }, this.timer = 35000)
  }

  stopAutoplay() {
    if (this.autoplayTimer) {
      clearInterval(this.autoplayTimer)
      this.autoplayTimer = null
    }
  }

  handlePageChange() {
    this.startAutoplay() // Reinicia el autoplay cuando el usuario cambia la página manualmente
  }
}
