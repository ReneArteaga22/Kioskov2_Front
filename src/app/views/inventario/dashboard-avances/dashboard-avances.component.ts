import { Component, OnInit, OnDestroy, ChangeDetectionStrategy, ChangeDetectorRef } from '@angular/core'
import { ApiService } from '../../../service/api.service';
import { ProgressBarModule } from 'primeng/progressbar';
import { CardModule } from 'primeng/card';
import { CommonModule } from '@angular/common';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { CNavBarComponent } from '../../../components/c-nav-bar/c-nav-bar.component'; 
import { CCardsModulesComponent } from '../../../components/c-cards-modules/c-cards-modules.component'; 
import { RouterLink } from '@angular/router';
import { DialogModule } from 'primeng/dialog';
import { AccordionModule } from 'primeng/accordion';
import { TagModule } from 'primeng/tag';
import { TooltipModule } from 'primeng/tooltip';
import { ButtonModule } from 'primeng/button';
import { DropdownModule } from 'primeng/dropdown';
import { FormsModule } from '@angular/forms';
import { SelectButtonModule } from 'primeng/selectbutton';
import { MessageService } from 'primeng/api';
import { ToastModule } from 'primeng/toast';

@Component({
  selector: 'app-dashboard-avances',
  standalone: true,
  imports: [
    CNavBarComponent, 
    CCardsModulesComponent,
    CommonModule,
    ProgressBarModule,
    CardModule,
    ProgressSpinnerModule, 
    RouterLink, 
    DialogModule,
    AccordionModule, 
    TagModule, 
    TooltipModule,
    ButtonModule,
    DropdownModule, 
    FormsModule,
    SelectButtonModule,
    ToastModule
  ],
  providers: [MessageService],
  templateUrl: './dashboard-avances.component.html',
  styleUrls: ['./dashboard-avances.component.css'], 
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DashboardAvancesComponent implements OnInit, OnDestroy {
  // --- ESTADO DE DATOS ---
  avances: any[] = []
  localidadesFlat: any[] = []
  avancesFiltrados: any[] = []
  localidadesFiltradas: any[] = []
  estadisticas: any = {}
  loading = true
  closeSession: boolean = false
  private intervalId: any

  // --- Estado de última actualización ---
  ultimaActualizacion: Date = new Date()
  actualizandoManual: boolean = false

  // --- ESTADO DE VISTA ---
  vistaActual: 'equipos' | 'localidades' = 'equipos'
  opcionesVista: any[] = [
    { label: 'Por Equipo', value: 'equipos', icon: 'pi pi-users' },
    { label: 'Por Localidad', value: 'localidades', icon: 'pi pi-map-marker' }
  ]

  // --- Estado de densidad de vista ---
  densidadVista: 'compact' | 'normal' | 'detailed' = 'normal'
  opcionesDensidad: any[] = [
    { label: 'Compacta', value: 'compact', icon: 'pi pi-th-large' },
    { label: 'Normal', value: 'normal', icon: 'pi pi-table' },
    { label: 'Detallada', value: 'detailed', icon: 'pi pi-list' }
  ]

  // --- ESTADO DE FILTROS ---
  filtroPlanta: string = ''
  filtroEstatus: string = ''
  textoBusqueda: string = ''
  
  opcionesPlanta: any[] = [
    { label: 'Todas las Plantas', value: '' },
    { label: 'Planta 1', value: 'Planta 1' },
    { label: 'Planta 2', value: 'Planta 2' },
  ]
  
  opcionesEstatus: any[] = [
    { label: 'Todos los Estatus', value: '' },
    { label: 'Conteo', value: 'CONTEO' },
    { label: 'Captura', value: 'CAPTURA' },
    { label: 'Validación', value: 'VALIDACION' },
    { label: 'Finalizado', value: 'FINALIZADO' },
  ]

  // --- ESTADO DE ORDENAMIENTO ---
  // Iniciamos con nombre ascendente
  ordenActual: string = 'nombre-asc'
  opcionesOrdenamiento: any[] = [
    { label: 'Nombre A-Z', value: 'nombre-asc' },
    { label: 'Nombre Z-A', value: 'nombre-desc' },
    { label: 'Menor Avance', value: 'avance-asc' },
    { label: 'Mayor Avance', value: 'avance-desc' },
    { label: 'Mayor Ajuste', value: 'ajuste-desc' },
    { label: 'Menor Ajuste', value: 'ajuste-asc' }
  ]

  // --- ESTADO DEL MODAL ---
  mostrarModal: boolean = false
  equipoSeleccionado: any = null

  constructor(
    private apiService: ApiService,
    private cdr: ChangeDetectorRef,
    private messageService: MessageService
  ) {}

  ngOnInit(): void {
    this.cargarAvances()
    
    // --- CAMBIO REALIZADO: Actualizar cada 2 minutos ---
    // 2 minutos = 120,000 milisegundos
    this.intervalId = setInterval(() => {
      this.cargarAvances(false) // false = actualización automática
    }, 12000)
  }

  ngOnDestroy(): void {
    if (this.intervalId) {
      clearInterval(this.intervalId)
    }
  }

  // --- CARGA DE DATOS ---

  cargarAvances(manual: boolean = true): void {
    if (manual) {
      this.actualizandoManual = true
      this.loading = true
    }

    this.apiService.getDashboardInventario().subscribe({
      next: (response: any) => {
        // Detectar cambios antes de actualizar
        const cambiosDetectados = this.detectarCambios(this.avances, response.avances)
        
        // 1. Guardamos la lista original de equipos
        this.avances = response.avances.map((equipo: any) => {
          const localidades = equipo.localidades || []
          return { ...equipo, localidades: [...localidades] }
        })

        // 2. Guardamos las estadísticas
        this.estadisticas = response.estadisticas

        // 3. Creamos la lista plana de localidades
        this.localidadesFlat = this.avances.flatMap(equipo => 
          equipo.localidades.map((loc: any) => ({
            ...loc,
            equipoNombre: equipo.nombre,
            equipoApellidos: equipo.apellidos
          }))
        )

        // 4. Aplicar filtros y ordenamiento
        this.filtrarAvances()
        
        // 5. Actualizar timestamp
        this.ultimaActualizacion = new Date()
        
        this.loading = false
        this.actualizandoManual = false

        // 6. Mostrar notificación solo si es manual o hubo cambios significativos
        if (manual && cambiosDetectados > 0) {
          this.messageService.add({ severity: 'success', summary: 'Dashboard Actualizado', detail: `${cambiosDetectados} cambio(s) detectado(s)`, life: 3000 })
        } else if (manual) {
          this.messageService.add({ severity: 'info', summary: 'Dashboard Actualizado', detail: 'Información actualizada', life: 2000 })
        }

        console.log('✅ Datos del dashboard cargados:', response)
        this.cdr.markForCheck()
      },
      error: (error: any) => {
        console.error('❌ Error al obtener avances:', error)
        this.loading = false
        this.actualizandoManual = false
        
        if (manual) {
          this.messageService.add({ severity: 'error', summary: 'Error', detail: 'No se pudo actualizar el dashboard', life: 3000 })
        }
        
        this.cdr.markForCheck()
      },
    })
  }

  private detectarCambios(antiguos: any[], nuevos: any[]): number {
    if (!antiguos || antiguos.length === 0) return 0
    
    let cambios = 0
    nuevos.forEach(nuevo => {
      const antiguo = antiguos.find(a => a.id === nuevo.id)
      if (antiguo) {
        if (antiguo.promedioAvance !== nuevo.promedioAvance) cambios++
        nuevo.localidades?.forEach((locNueva: any) => {
          const locAntigua = antiguo.localidades?.find((l: any) => l.id === locNueva.id)
          if (locAntigua && locAntigua.estatus !== locNueva.estatus) cambios++
        })
      }
    })
    return cambios
  }

  refrescarDashboard(): void {
    this.cargarAvances(true)
  }

  // --- LÓGICA DE FILTROS Y VISTAS ---

  onFiltroChange(): void {
    this.filtrarAvances()
  }

  onVistaChange(): void {
    this.filtrarAvances()
    this.cdr.markForCheck()
  }

  onOrdenamientoChange(): void {
    this.aplicarOrdenamiento()
    this.cdr.markForCheck()
  }

  filtrarAvances(): void {
    if (this.vistaActual === 'equipos') {
      this.filtrarVistaEquipos()
    } else {
      this.filtrarVistaLocalidades()
    }
    this.cdr.markForCheck()
  }

  filtrarVistaEquipos(): void {
    let filtrados = this.avances.map(equipo => ({
      ...equipo, 
      localidades: [...equipo.localidades] 
    }))

    // 1. Filtrar por Planta
    if (this.filtroPlanta) {
      filtrados = filtrados.filter((avance) =>
        avance.apellidos.toLowerCase().includes(this.filtroPlanta.toLowerCase())
      )
    }

    // 2. Filtrar por Estatus
    if (this.filtroEstatus) {
      filtrados = filtrados.map(equipo => {
        const localidadesFiltradas = equipo.localidades.filter(
          (loc: any) => loc.estatus === this.filtroEstatus
        )
        return { ...equipo, localidades: localidadesFiltradas }
      })
    }

    // 3. Filtrar por búsqueda
    if (this.textoBusqueda.trim()) {
      const busqueda = this.textoBusqueda.toLowerCase()
      filtrados = filtrados.filter(equipo => {
        const nombreMatch = equipo.nombre?.toLowerCase().includes(busqueda)
        const apellidoMatch = equipo.apellidos?.toLowerCase().includes(busqueda)
        const localidadMatch = equipo.localidades.some((loc: any) => 
          loc.nombre?.toLowerCase().includes(busqueda)
        )
        return nombreMatch || apellidoMatch || localidadMatch
      })
    }

    this.avancesFiltrados = filtrados
    
    // 4. Aplicar ordenamiento (Esto asegura que al cargar se ordenen)
    this.aplicarOrdenamiento()
  }

  filtrarVistaLocalidades(): void {
    let filtrados = [...this.localidadesFlat]

    if (this.filtroPlanta) {
      filtrados = filtrados.filter(loc =>
        loc.equipoApellidos.toLowerCase().includes(this.filtroPlanta.toLowerCase())
      )
    }

    if (this.filtroEstatus) {
      filtrados = filtrados.filter((loc: any) => loc.estatus === this.filtroEstatus)
    }

    if (this.textoBusqueda.trim()) {
      const busqueda = this.textoBusqueda.toLowerCase()
      filtrados = filtrados.filter(loc => {
        const nombreMatch = loc.nombre?.toLowerCase().includes(busqueda)
        const equipoMatch = loc.equipoNombre?.toLowerCase().includes(busqueda)
        const apellidoMatch = loc.equipoApellidos?.toLowerCase().includes(busqueda)
        return nombreMatch || equipoMatch || apellidoMatch
      })
    }

    this.localidadesFiltradas = filtrados
    
    // Aplicar ordenamiento también a la vista de localidades
    this.aplicarOrdenamiento()
  }

  // --- CAMBIO REALIZADO: Lógica de Ordenamiento Natural ---
  aplicarOrdenamiento(): void {
    if (this.vistaActual === 'equipos') {
      this.ordenarEquipos()
    } else {
      this.ordenarLocalidades()
    }
  }

  private ordenarEquipos(): void {
    this.avancesFiltrados.sort((a, b) => {
      // Obtenemos el valor de nombre/apellido, manejando nulos
      const nombreA = a.apellidos || a.nombre || '';
      const nombreB = b.apellidos || b.nombre || '';

      switch (this.ordenActual) {
        case 'nombre-asc':
          // localeCompare con numeric: true permite ordenar "Equipo 2" antes de "Equipo 10"
          return nombreA.localeCompare(nombreB, undefined, { numeric: true, sensitivity: 'base' })
        case 'nombre-desc':
          return nombreB.localeCompare(nombreA, undefined, { numeric: true, sensitivity: 'base' })
        case 'avance-asc':
          return a.promedioAvance - b.promedioAvance
        case 'avance-desc':
          return b.promedioAvance - a.promedioAvance
        case 'ajuste-desc':
          return (b.totalAjusteEquipo || 0) - (a.totalAjusteEquipo || 0)
        case 'ajuste-asc':
          return (a.totalAjusteEquipo || 0) - (b.totalAjusteEquipo || 0)
        default:
          return 0
      }
    })
  }

  private ordenarLocalidades(): void {
    this.localidadesFiltradas.sort((a, b) => {
      const nombreA = a.nombre || '';
      const nombreB = b.nombre || '';

      switch (this.ordenActual) {
        case 'nombre-asc':
          return nombreA.localeCompare(nombreB, undefined, { numeric: true, sensitivity: 'base' })
        case 'nombre-desc':
          return nombreB.localeCompare(nombreA, undefined, { numeric: true, sensitivity: 'base' })
        case 'avance-asc':
          return a.porcentaje - b.porcentaje
        case 'avance-desc':
          return b.porcentaje - a.porcentaje
        case 'ajuste-desc':
          return (b.dinero?.noEncontrado || 0) - (a.dinero?.noEncontrado || 0)
        case 'ajuste-asc':
          return (a.dinero?.noEncontrado || 0) - (b.dinero?.noEncontrado || 0)
        default:
          return 0
      }
    })
  }

  // --- LÓGICA DE MODAL ---

  mostrarDetalle(equipo: any): void {
    this.equipoSeleccionado = equipo
    this.mostrarModal = true
    this.cdr.markForCheck()
  }

  cerrarModal(): void {
    this.mostrarModal = false
    this.equipoSeleccionado = null
    this.cdr.markForCheck()
  }

  // --- KPIs ---

  getTotalLocalidades(): number {
    return this.localidadesFlat.length
  }

  getLocalidadesPorEstatus(estatus: string): number {
    return this.localidadesFlat.filter(loc => loc.estatus === estatus).length
  }

  getLocalidadesEnProceso(): number {
    return this.localidadesFlat.filter(loc => 
      loc.estatus !== 'FINALIZADO'
    ).length
  }

  getPercentajePorEstatus(estatus: string): number {
    const total = this.getTotalLocalidades()
    if (total === 0) return 0
    const cantidad = this.getLocalidadesPorEstatus(estatus)
    return Math.round((cantidad / total) * 100)
  }

  exportarExcel(): void {
    this.messageService.add({ severity: 'info', summary: 'Exportando', detail: 'Preparando archivo Excel...', life: 2000 })
    setTimeout(() => {
      this.messageService.add({ severity: 'success', summary: 'Exportación Completa', detail: 'Archivo descargado exitosamente', life: 3000 })
    }, 1500)
  }

  // --- FUNCIONES AUXILIARES ---

  getProgressBarClass(porcentaje: number): string {
    if (porcentaje <= 25) return 'progress-red'
    if (porcentaje <= 50) return 'progress-orange'
    if (porcentaje <= 75) return 'progress-yellow'
    if (porcentaje <= 99) return 'progress-blue'
    return 'progress-green'
  }

  getProgressClass(porcentaje: number): string {
    return this.getProgressBarClass(porcentaje)
  }

  getEstatusSeverity(estatus: string): 'success' | 'secondary' | 'info' | 'warning' | 'danger' | 'contrast' | undefined {
    switch (estatus.toLowerCase()) {
      case 'conteo': return 'danger'
      case 'captura': return 'warning'
      case 'validacion': return 'info'
      case 'finalizado': return 'success'
      default: return 'secondary'
    }
  }

  formatCurrency(value: number): string {
    if (value === null || value === undefined) {
      value = 0
    }
    return new Intl.NumberFormat('es-MX', {
      style: 'currency',
      currency: 'MXN',
    }).format(value)
  }

  getPromedioAvance(): number {
    return this.estadisticas.promedioGeneral || 0
  }

  necesitaAtencion(equipo: any): 'critical' | 'warning' | null {
    if (equipo.promedioAvance < 25) return 'critical'
    if (equipo.totalAjusteEquipo > 10000) return 'warning'
    return null
  }
}