import { Component, ElementRef, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { forkJoin } from 'rxjs';
import { ConfirmationService, MessageService } from 'primeng/api';
import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { InputTextareaModule } from 'primeng/inputtextarea';
import { InputNumberModule } from 'primeng/inputnumber';
import { DropdownModule } from 'primeng/dropdown';
import { MultiSelectModule } from 'primeng/multiselect';
import { TagModule } from 'primeng/tag';
import { DialogModule } from 'primeng/dialog';
import { ToastModule } from 'primeng/toast';
import { TooltipModule } from 'primeng/tooltip';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import {
  ESTADOS, EstadoLista, Equipo, HistorialLista, InventarioService, Lista, Localidad, mensajeError,
} from '../../../service/inventario.service';

/** Lista + campos precalculados para la tabla (evita funciones en el template). */
interface Fila extends Lista {
  equipoNombre: string;
  principalNombre: string;
  otrasLocalidades: string;
  minutos: number | null;
  detenida: boolean;
  siguiente: EstadoLista | null;
}
interface Opcion<T> { label: string; value: T; }

const UMBRAL_DETENIDA_MIN = 45;
const ETIQUETA: Record<EstadoLista, string> = {
  SIN_ENTREGAR: 'Sin entregar', CONTEO: 'Conteo', CAPTURA: 'Captura', VALIDACION: 'Validación', FINALIZADO: 'Finalizado',
};
const ACCION_SIGUIENTE: Record<EstadoLista, string> = {
  SIN_ENTREGAR: 'Entregar', CONTEO: 'A captura', CAPTURA: 'A validación', VALIDACION: 'Finalizar', FINALIZADO: '',
};

@Component({
  selector: 'app-inv-admin',
  standalone: true,
  imports: [
    CommonModule, FormsModule, RouterLink, TableModule, ButtonModule, InputTextModule, InputTextareaModule,
    InputNumberModule, DropdownModule, MultiSelectModule, TagModule, DialogModule, ToastModule, TooltipModule,
    ConfirmDialogModule,
  ],
  providers: [MessageService, ConfirmationService],
  templateUrl: './inv-admin.component.html',
  styleUrls: ['./inv-admin.component.css'],
})
export class InvAdminComponent implements OnInit, OnDestroy {
  @ViewChild('folioInput') folioInput?: ElementRef<HTMLInputElement>;

  readonly ESTADOS = ESTADOS;
  readonly etiqueta = ETIQUETA;
  readonly accionSiguiente = ACCION_SIGUIENTE;

  // ───────── Datos ─────────
  filas: Fila[] = [];
  filtradas: Fila[] = [];
  equipos: Equipo[] = [];
  localidades: Localidad[] = [];
  conteo: Record<EstadoLista, number> = this.conteoVacio();
  cargando = true;
  ocupado = false;
  private timer?: ReturnType<typeof setInterval>;

  // ───────── Opciones ─────────
  opcionesEquipo: Opcion<number>[] = [];
  opcionesLocalidad: Opcion<number>[] = [];
  opcionesEstado: Opcion<EstadoLista>[] = ESTADOS.map((e) => ({ label: ETIQUETA[e], value: e }));

  // ───────── Filtros ─────────
  busqueda = '';
  filtroEstado: EstadoLista | null = null;
  filtroEquipo: number | null = null;
  soloDetenidas = false;

  // ───────── Alta rápida ─────────
  nuevo = { folio: '', descripcion: '', localidadIds: [] as number[], principalId: null as number | null, equipoId: null as number | null };
  opcionesPrincipal: Opcion<number>[] = [];
  equipoSugerido = '';

  // ───────── Selección y masivos ─────────
  seleccion: Fila[] = [];
  estadoMasivo: EstadoLista | null = null;

  // ───────── Diálogos ─────────
  dlgEstado = { visible: false, fila: null as Fila | null, estado: null as EstadoLista | null, comentario: '' };
  dlgAjuste = { visible: false, fila: null as Fila | null, sobrante: 0, faltante: 0 };
  dlgReasignar = { visible: false, equipoId: null as number | null, motivo: '' };
  dlgDetalle = { visible: false, data: null as HistorialLista | null };

  constructor(
    private inv: InventarioService,
    private toast: MessageService,
    private confirm: ConfirmationService,
  ) {}

  ngOnInit(): void {
    this.cargarCatalogos();
    // Refresco silencioso para actualizar "tiempo en estado"
    this.timer = setInterval(() => this.cargarListas(false), 60_000);
  }

  ngOnDestroy(): void {
    if (this.timer) clearInterval(this.timer);
  }

  // ═════════════════ CARGA ═════════════════

  cargarCatalogos(): void {
    this.cargando = true;
    forkJoin({ equipos: this.inv.equipos(), localidades: this.inv.localidades() }).subscribe({
      next: ({ equipos, localidades }) => {
        this.equipos = equipos;
        this.localidades = localidades;
        this.opcionesEquipo = equipos.filter((e) => e.activo).map((e) => ({ label: e.nombre, value: e.id }));
        this.opcionesLocalidad = localidades.map((l) => ({
          label: `${l.area?.codigo ?? '?'} · ${l.nombre}${l.equipoPlaneado ? ' (' + l.equipoPlaneado.nombre + ')' : ''}`,
          value: l.id,
        }));
        this.cargarListas(false);
      },
      error: (e) => { this.cargando = false; this.error(e); },
    });
  }

  cargarListas(avisar = true): void {
    this.inv.listas().subscribe({
      next: (listas) => {
        this.filas = listas.map((l) => this.aFila(l));
        const ids = new Set(this.seleccion.map((s) => s.id));
        this.seleccion = this.filas.filter((f) => ids.has(f.id)); // conserva selección tras recargar
        this.recalcular();
        this.cargando = false;
        if (avisar) this.toast.add({ severity: 'info', summary: 'Actualizado', life: 1500 });
      },
      error: (e) => { this.cargando = false; this.error(e); },
    });
  }

  private aFila(l: Lista): Fila {
    const locs = l.localidades ?? [];
    const principal = locs.find((x) => x.esPrincipal) ?? locs[0];
    const activa = l.estado !== 'SIN_ENTREGAR' && l.estado !== 'FINALIZADO';
    const minutos = l.estado === 'FINALIZADO' ? null
      : Math.max(0, Math.round((Date.now() - new Date(l.estadoDesde).getTime()) / 60000));
    const i = ESTADOS.indexOf(l.estado);
    return {
      ...l,
      equipoNombre: l.equipoActual?.nombre ?? '— Sin equipo —',
      principalNombre: principal ? `${principal.area?.codigo ?? ''} · ${principal.nombre}` : '—',
      otrasLocalidades: locs.filter((x) => x !== principal).map((x) => x.nombre).join(', '),
      minutos,
      detenida: activa && (minutos ?? 0) >= UMBRAL_DETENIDA_MIN,
      siguiente: i < ESTADOS.length - 1 ? ESTADOS[i + 1] : null,
    };
  }

  private conteoVacio(): Record<EstadoLista, number> {
    return { SIN_ENTREGAR: 0, CONTEO: 0, CAPTURA: 0, VALIDACION: 0, FINALIZADO: 0 };
  }

  // ═════════════════ FILTROS ═════════════════

  recalcular(): void {
    const c = this.conteoVacio();
    this.filas.forEach((f) => c[f.estado]++);
    this.conteo = c;

    const q = this.busqueda.trim().toUpperCase();
    this.filtradas = this.filas.filter((f) =>
      (!q || f.folio.toUpperCase().includes(q) || f.principalNombre.toUpperCase().includes(q) || f.otrasLocalidades.toUpperCase().includes(q)) &&
      (!this.filtroEstado || f.estado === this.filtroEstado) &&
      (!this.filtroEquipo || f.equipoActualId === this.filtroEquipo) &&
      (!this.soloDetenidas || f.detenida)
    );
  }

  filtrarPorEstado(e: EstadoLista): void {
    this.filtroEstado = this.filtroEstado === e ? null : e;
    this.recalcular();
  }

  limpiarFiltros(): void {
    this.busqueda = '';
    this.filtroEstado = null;
    this.filtroEquipo = null;
    this.soloDetenidas = false;
    this.recalcular();
  }

  get totalDetenidas(): number { return this.filas.filter((f) => f.detenida).length; }
  get avance(): number {
    return this.filas.length ? Math.round((this.conteo.FINALIZADO / this.filas.length) * 1000) / 10 : 0;
  }

  // ═════════════════ ALTA RÁPIDA ═════════════════

  onLocalidadesChange(): void {
    const ids = this.nuevo.localidadIds;
    this.opcionesPrincipal = this.opcionesLocalidad.filter((o) => ids.includes(o.value));
    if (!this.nuevo.principalId || !ids.includes(this.nuevo.principalId)) this.nuevo.principalId = ids[0] ?? null;
    this.actualizarSugerido();
  }

  actualizarSugerido(): void {
    const loc = this.localidades.find((l) => l.id === this.nuevo.principalId);
    this.equipoSugerido = loc?.equipoPlaneado?.nombre ?? '';
  }

  crearLista(): void {
    const folio = this.nuevo.folio.trim();
    if (!folio) return this.aviso('Captura el folio');
    if (!this.nuevo.localidadIds.length) return this.aviso('Selecciona al menos una localidad');
    if (!this.nuevo.equipoId && !this.equipoSugerido) return this.aviso('La localidad principal no tiene equipo planeado: elige un equipo');

    this.ocupado = true;
    this.inv.crearLista({
      folio,
      descripcion: this.nuevo.descripcion.trim() || null,
      equipoId: this.nuevo.equipoId,
      localidades: this.nuevo.localidadIds.map((id) => ({ localidadId: id, principal: id === this.nuevo.principalId })),
    }).subscribe({
      next: (r) => {
        this.ok(r.mensaje);
        // Se conservan localidades y equipo: suele haber varias listas seguidas de la misma localidad
        this.nuevo.folio = '';
        this.nuevo.descripcion = '';
        this.folioInput?.nativeElement.focus();
        this.fin();
      },
      error: (e) => this.fin(e),
    });
  }

  limpiarAlta(): void {
    this.nuevo = { folio: '', descripcion: '', localidadIds: [], principalId: null, equipoId: null };
    this.opcionesPrincipal = [];
    this.equipoSugerido = '';
  }

  // ═════════════════ ACCIONES POR LISTA ═════════════════

  avanzar(f: Fila): void {
    const ejecutar = () => {
      this.ocupado = true;
      this.inv.avanzar(f.id).subscribe({ next: (r) => { this.ok(r.mensaje); this.fin(); }, error: (e) => this.fin(e) });
    };
    if (f.estado === 'VALIDACION' && f.ajustePositivo === 0 && f.ajusteNegativo === 0) {
      this.confirm.confirm({
        header: 'Finalizar sin ajuste',
        message: `${f.folio} no tiene ajuste capturado ($0). ¿Finalizar de todos modos?`,
        acceptLabel: 'Finalizar', rejectLabel: 'Cancelar', icon: 'pi pi-exclamation-triangle',
        accept: ejecutar,
      });
      return;
    }
    ejecutar();
  }

  abrirEstado(f: Fila): void {
    this.dlgEstado = { visible: true, fila: f, estado: null, comentario: '' };
  }

  get esRetroceso(): boolean {
    const d = this.dlgEstado;
    return !!d.fila && !!d.estado && ESTADOS.indexOf(d.estado) < ESTADOS.indexOf(d.fila.estado);
  }

  guardarEstado(): void {
    const d = this.dlgEstado;
    if (!d.fila || !d.estado) return this.aviso('Selecciona el estado');
    if (this.esRetroceso && !d.comentario.trim()) return this.aviso('Regresar de estado requiere comentario');
    this.ocupado = true;
    this.inv.cambiarEstado(d.fila.id, d.estado, d.comentario.trim() || undefined).subscribe({
      next: (r) => { this.ok(r.mensaje); this.dlgEstado.visible = false; this.fin(); },
      error: (e) => this.fin(e),
    });
  }

  puedeAjuste(f: Fila): boolean {
    return f.estado === 'VALIDACION' || f.estado === 'FINALIZADO';
  }

  abrirAjuste(f: Fila): void {
    this.dlgAjuste = { visible: true, fila: f, sobrante: f.ajustePositivo, faltante: Math.abs(f.ajusteNegativo) };
  }

  get netoAjuste(): number {
    return (this.dlgAjuste.sobrante || 0) - (this.dlgAjuste.faltante || 0);
  }

  guardarAjuste(): void {
    const d = this.dlgAjuste;
    if (!d.fila) return;
    const folio = d.fila.folio;
    this.ocupado = true;
    this.inv.registrarAjuste(d.fila.id, d.sobrante || 0, d.faltante || 0).subscribe({
      next: (r) => { this.ok(`${folio}: ${r.mensaje}`); this.dlgAjuste.visible = false; this.fin(); },
      error: (e) => this.fin(e),
    });
  }

  verDetalle(f: Fila): void {
    this.dlgDetalle = { visible: true, data: null };
    this.inv.detalleLista(f.id).subscribe({
      next: (d) => (this.dlgDetalle.data = d),
      error: (e) => { this.dlgDetalle.visible = false; this.error(e); },
    });
  }

  eliminar(f: Fila): void {
    this.confirm.confirm({
      header: 'Eliminar lista',
      message: `¿Eliminar ${f.folio}? Solo se permite si no se ha entregado.`,
      acceptLabel: 'Eliminar', rejectLabel: 'Cancelar', icon: 'pi pi-trash',
      acceptButtonStyleClass: 'p-button-danger',
      accept: () => {
        this.ocupado = true;
        this.inv.eliminarLista(f.id).subscribe({ next: (r) => { this.ok(r.mensaje); this.fin(); }, error: (e) => this.fin(e) });
      },
    });
  }

  // ═════════════════ MASIVOS ═════════════════

  aplicarEstadoMasivo(): void {
    if (!this.seleccion.length || !this.estadoMasivo) return this.aviso('Selecciona listas y estado');
    const estado = this.estadoMasivo;
    this.ocupado = true;
    this.inv.estadoMasivo(this.seleccion.map((s) => s.id), estado).subscribe({
      next: (r) => {
        const { exitosas, errores } = r.data;
        if (exitosas.length) this.ok(`${exitosas.length} lista(s) → ${ETIQUETA[estado]}`);
        errores.slice(0, 5).forEach((er) => this.toast.add({ severity: 'warn', summary: 'No aplicada', detail: er.mensaje, life: 6000 }));
        if (errores.length > 5) this.aviso(`…y ${errores.length - 5} más con error`);
        this.seleccion = [];
        this.estadoMasivo = null;
        this.fin();
      },
      error: (e) => this.fin(e),
    });
  }

  abrirReasignar(): void {
    if (!this.seleccion.length) return this.aviso('Selecciona al menos una lista');
    this.dlgReasignar = { visible: true, equipoId: null, motivo: '' };
  }

  guardarReasignar(): void {
    const d = this.dlgReasignar;
    if (!d.equipoId) return this.aviso('Selecciona el equipo destino');
    if (!d.motivo.trim()) return this.aviso('Captura el motivo');
    this.ocupado = true;
    this.inv.reasignar(this.seleccion.map((s) => s.id), d.equipoId, d.motivo.trim()).subscribe({
      next: (r) => {
        this.ok(r.mensaje);
        r.data.omitidas.slice(0, 5).forEach((o) => this.toast.add({ severity: 'warn', summary: o.folio, detail: o.razon, life: 5000 }));
        this.dlgReasignar.visible = false;
        this.seleccion = [];
        this.fin();
      },
      error: (e) => this.fin(e),
    });
  }

  // ═════════════════ AUXILIARES ═════════════════

  severidad(e: EstadoLista): 'success' | 'secondary' | 'info' | 'warning' | 'danger' {
    switch (e) {
      case 'CONTEO': return 'danger';
      case 'CAPTURA': return 'warning';
      case 'VALIDACION': return 'info';
      case 'FINALIZADO': return 'success';
      default: return 'secondary';
    }
  }
  etiquetaDe(estado: EstadoLista | string): string {
   return this.etiqueta[estado as EstadoLista] ?? estado;
  }

  accionDe(estado: EstadoLista | string): string {
    return this.accionSiguiente[estado as EstadoLista] ?? 'Avanzar';
  }

  tiempo(min: number | null | undefined): string {
    if (min === null || min === undefined) return '—';
    if (min < 60) return `${min} min`;
    return `${Math.floor(min / 60)} h ${String(min % 60).padStart(2, '0')} min`;
  }

  moneda(v: number | null | undefined): string {
    return new Intl.NumberFormat('es-MX', { style: 'currency', currency: 'MXN' }).format(v ?? 0);
  }

  minutosFase(e: EstadoLista): number | undefined {
    return this.dlgDetalle.data?.minutosPorEstado[e];
  }

  private ok(detail: string): void {
    this.toast.add({ severity: 'success', summary: 'Listo', detail, life: 2500 });
  }
  private aviso(detail: string): void {
    this.toast.add({ severity: 'warn', summary: 'Revisa', detail, life: 3500 });
  }
  private error(e: unknown): void {
    this.toast.add({ severity: 'error', summary: 'Error', detail: mensajeError(e), life: 5000 });
  }
  /** Cierra una operación: muestra el error si lo hay; si no, recarga la tabla. */
  private fin(e?: unknown): void {
    this.ocupado = false;
    if (e) this.error(e);
    else this.cargarListas(false);
  }
}