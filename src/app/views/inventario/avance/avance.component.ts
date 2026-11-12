import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ApiService } from '../../../service/api.service'; // Ajusta la ruta
import { TableModule } from 'primeng/table';
import { DropdownModule } from 'primeng/dropdown';
import { InputNumberModule } from 'primeng/inputnumber';
import { ButtonModule } from 'primeng/button';
import { ToastModule } from 'primeng/toast';
import { MessageService } from 'primeng/api';
import { ToolbarModule } from 'primeng/toolbar';
import { TagModule } from 'primeng/tag';
import { InputTextModule } from 'primeng/inputtext';
import { CNavBarComponent} from '../../../components/c-nav-bar/c-nav-bar.component';

@Component({
  selector: 'app-avance',
  standalone: true,
  imports: [    CommonModule,
      FormsModule,
      TableModule,
      DropdownModule,
      InputNumberModule,
      ButtonModule,
      ToastModule,
      ToolbarModule,
      TagModule,
      InputTextModule,
      CNavBarComponent ],
  templateUrl: './avance.component.html',
  styleUrl: './avance.component.css'
})
export class AvanceComponent implements OnInit {
  localidades: any[] = [];
  loading: boolean = true;
  clonedLocalidades: { [s: string]: any } = {}; // Para guardar estado original al editar

  // Opciones para el dropdown de estatus
  estatusOptions = [
    { label: 'Conteo', value: 'CONTEO' },
    { label: 'Captura', value: 'CAPTURA' },
    { label: 'Validación', value: 'VALIDACION' },
    { label: 'Finalizado', value: 'FINALIZADO' }
  ];

  constructor(
    private apiService: ApiService,
    private messageService: MessageService
  ) {}

  ngOnInit() {
    this.cargarDatos();
  }

  cargarDatos() {
    this.loading = true;
    // Usamos el endpoint que trae todas las localidades
    // Asegúrate de tener este método en tu ApiService: return this.http.get('/api/localidades');
    this.apiService.getLocalidades().subscribe({
      next: (res: any) => {
        // Asumiendo que tu API devuelve { success: true, localidades: [...] }
        this.localidades = res.localidades;
        this.loading = false;
      },
      error: (err) => {
        this.messageService.add({ severity: 'error', summary: 'Error', detail: 'No se pudieron cargar los datos' });
        this.loading = false;
      }
    });
  }

  // Iniciar edición de una fila
  onRowEditInit(localidad: any) {
    this.clonedLocalidades[localidad.id] = { ...localidad };
  }

  // Guardar cambios de una fila
  onRowEditSave(localidad: any) {
    // Validaciones básicas (opcional)
    if (localidad.dineroEncontrado < 0) {
        this.messageService.add({ severity: 'error', summary: 'Error', detail: 'El dinero encontrado no puede ser negativo' });
        // Revertir cambios
        this.localidades[this.findIndexById(localidad.id)] = this.clonedLocalidades[localidad.id];
        return;
    }

    // Preparar el objeto para la API
    // Usamos el endpoint PATCH /api/localidades/:id/estatus
    const payload = {
      estatus: localidad.estatus,
      dineroEncontrado: localidad.dineroEncontrado,
      dineroAjuste: localidad.dineroAjuste
    };

    this.apiService.updateLocalidadEstatus(localidad.id, payload).subscribe({
      next: (res) => {
        delete this.clonedLocalidades[localidad.id];
        this.messageService.add({ severity: 'success', summary: 'Actualizado', detail: `Localidad ${localidad.localidadNombre} actualizada` });
      },
      error: (err) => {
        this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Falló la actualización' });
        // Revertir cambios visuales si falla la API
        this.localidades[this.findIndexById(localidad.id)] = this.clonedLocalidades[localidad.id];
        delete this.clonedLocalidades[localidad.id];
      }
    });
  }

  // Cancelar edición
  onRowEditCancel(localidad: any, index: number) {
    this.localidades[index] = this.clonedLocalidades[localidad.id];
    delete this.clonedLocalidades[localidad.id];
  }

  // Helper
  findIndexById(id: string): number {
    return this.localidades.findIndex(item => item.id === id);
  }

  getSeverity(estatus: string) {
    switch (estatus) {
      case 'CONTEO': return 'danger';
      case 'CAPTURA': return 'warning';
      case 'VALIDACION': return 'info'; // Usando tu variable azul
      case 'FINALIZADO': return 'success';
      default: return 'secondary';
    }
  }
}