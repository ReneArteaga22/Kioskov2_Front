import { Component, OnInit } from '@angular/core'
import { Router, RouterLink } from '@angular/router'
import { ApiService } from '../../service/api.service'
import { NgFor } from '@angular/common'
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms'
import { CookieService } from 'ngx-cookie-service'
import { PaginatorModule } from 'primeng/paginator'
import { CNavBarComponent } from '../../components/c-nav-bar/c-nav-bar.component'
import { NgIf } from '@angular/common'
import { CFlechasComponent } from '../../components/c-flechas/c-flechas.component'

@Component({
  selector: 'app-usuarios',
  standalone: true,
  imports: [RouterLink, NgFor, ReactiveFormsModule, PaginatorModule, CNavBarComponent, NgIf,CFlechasComponent],
  templateUrl: './usuarios.component.html',
  styleUrl: './usuarios.component.css'
})
export class UsuariosComponent implements OnInit {
  buscarUsuarioForm: FormGroup
  isSubmit: boolean = false
  isRh:boolean = false
  isSistemas:boolean = false
  usuarios: any[] = []
  
  paginatedUsuarios: any[] = []
  first: number = 0
  rows: number = 15
  totalRecords: any

  constructor(private apiService: ApiService, private router: Router, private cookie: CookieService) {
    this.buscarUsuarioForm = new FormGroup({
      nombre: new FormControl(''),
      area: new FormControl('')
    })
  }

  ngOnInit(): void {
    let area = this.cookie.get('area')
    if(area === 'rh' || area === 'sistemas'){
      this.isSistemas = true
      this.isRh = true
    }
    this.apiService.lista_usuarios().subscribe(
      response => {
        this.usuarios = response.usuarios
        this.totalRecords = this.usuarios.length
        this.paginateUsuarios()
      },
      error => {
        console.error('Error al obtener la lista de usuarios', error)
      }
    )
  }

  paginateUsuarios() {
    this.paginatedUsuarios = this.usuarios.slice(this.first, this.first + this.rows)
  }

  onPageChange(event:any) {
    this.first = event.first
    this.rows = event.rows
    this.paginateUsuarios()
  }

  buscar_usuario() {
    if (this.buscarUsuarioForm.valid && !this.isSubmit) {
      this.apiService.buscar_usuario(this.buscarUsuarioForm.value).subscribe(
        response => {
          this.usuarios = response.filtro
          this.totalRecords = this.usuarios.length
          this.paginateUsuarios() // Actualiza paginación
        }
      )
    }
  }

  usuarios_info(id: number) {
    this.apiService.usuario_x_id(id).subscribe(
      response => {
        this.cookie.set('user_id', response.usuario.id)
        this.router.navigate(['/usuarios-info'])
      }
    )
  }
}
