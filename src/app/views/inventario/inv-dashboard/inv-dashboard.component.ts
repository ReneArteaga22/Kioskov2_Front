import { Component, OnDestroy, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { Subscription } from 'rxjs';
import { DropdownModule } from 'primeng/dropdown';
import { SelectButtonModule } from 'primeng/selectbutton';
import { ProgressBarModule } from 'primeng/progressbar';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { DialogModule } from 'primeng/dialog';
import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { TooltipModule } from 'primeng/tooltip';
import { InputTextModule } from 'primeng/inputtext';
import { InputSwitchModule } from 'primeng/inputswitch';
import {
  AreaDash, DashboardSnapshot, ESTADOS, EquipoDash, EstadoGeneral, EstadoLista, HistorialLista,
  InventarioService, ListaDash, LocalidadDash, mensajeError,
} from '../../../service/inventario.service';

/**
 * Dashboard PÚBLICO de solo lectura (Inventario 2026).
 * - Diseño basado en el dashboard original (navbar oscuro, KPIs, filtros oscuros, tarjetas).
 * - Pensado para volumen: tarjetas de altura fija, localidades agrupadas por área con paginado,
 *   vista "Listas" en tabla paginada y detalle bajo demanda en modales.
 * - NO muestra montos (decisión vigente).
 */

// ───────── Configuración ─────────
const TITULO = 'Status Inventario 2026';
const REFRESCO_SEG = 30;
const PAGINA_LOCALIDADES = 40;   // localidades visibles por área antes de "Mostrar más"
const PAGINA_EQUIPOS = 12;       // equipos visibles antes de "Mostrar más"
const TOP_DETENIDAS = 6;

type Vista = 'equipos' | 'localidades' | 'listas';
type Orden = 'atencion' | 'nombre' | 'avance-asc' | 'avance-desc' | 'detenidas' | 'pendientes';
type Nivel = 'none' | 'red' | 'orange' | 'blue' | 'green';
interface Opcion<T> { label: string; value: T; icon?: string; }

interface EquipoVM extends EquipoDash { nivel: Nivel; texto: string; }
interface LocalidadVM extends LocalidadDash { nivel: Nivel; texto: string; }
interface ListaVM extends ListaDash { principal: string; extra: number; areaCodigo: string; paso: number; texto: string; }
interface AreaVM extends AreaDash { nivel: Nivel; }
interface GrupoVM {
  id: number; codigo: string; nombre: string; avance: number; nivel: Nivel;
  total: number; finalizadas: number; detenidas: number;
  localidades: LocalidadVM[]; abierto: boolean; visibles: number;
}

const ETIQUETA: Record<EstadoLista, string> = {
  SIN_ENTREGAR: 'Sin entregar', CONTEO: 'Conteo', CAPTURA: 'Captura', VALIDACION: 'Validación', FINALIZADO: 'Finalizado',
};
const ABREV: Record<EstadoLista, string> = {
  SIN_ENTREGAR: 'S/Entr.', CONTEO: 'Conteo', CAPTURA: 'Captura', VALIDACION: 'Valid.', FINALIZADO: 'Final.',
};
const GENERAL: Record<EstadoGeneral, string> = {
  SIN_LISTAS: 'Sin listas', SIN_INICIAR: 'Sin iniciar', EN_PROCESO: 'En proceso', ATENCION: 'Atención', TERMINADO: 'Terminado',
};
const ROL: Record<string, string> = {
  CONTADOR: 'Contador', AUDITOR_PISO: 'Auditor de piso', HABILITADOR: 'Habilitador', AUXILIAR: 'Auxiliar',
  CAPTURISTA: 'Capturista', VALIDACION: 'Validación', SOLUCIONADOR: 'Solucionador', AUDITOR_EXTERNO: 'Auditor externo',
};

@Component({
  selector: 'app-inv-dashboard',
  standalone: true,
  imports: [
    CommonModule, FormsModule, RouterLink, DropdownModule, SelectButtonModule, ProgressBarModule,
    ProgressSpinnerModule, DialogModule, TableModule, ButtonModule, TooltipModule, InputTextModule, InputSwitchModule,
  ],
  templateUrl: './inv-dashboard.component.html',
  styleUrls: ['./inv-dashboard.component.css'],
})
export class InvDashboardComponent implements OnInit, OnDestroy {
  readonly titulo = TITULO;
  readonly ESTADOS = ESTADOS;

  // ───────── Estado de carga ─────────
  data: DashboardSnapshot | null = null;
  loading = true;
  actualizando = false;
  error = '';
  restante = REFRESCO_SEG;

  // ───────── Datos preparados ─────────
  nivelGlobal: Nivel = 'none';
  areas: AreaVM[] = [];
  detenidasTop: ListaDash[] = [];
  private equipos: EquipoVM[] = [];
  private localidades: LocalidadVM[] = [];
  private listas: ListaVM[] = [];
  private listaPorId = new Map<number, ListaVM>();

  // ───────── Resultado de filtros ─────────
  equiposFiltrados: EquipoVM[] = [];
  equiposPagina: EquipoVM[] = [];
  gruposFiltrados: GrupoVM[] = [];
  listasFiltradas: ListaVM[] = [];
  totalLocalidadesFiltradas = 0;

  // ───────── Filtros ─────────
  filtroArea: number | null = null;
  filtroEstatus: EstadoLista | null = null;
  textoBusqueda = '';
  ordenActual: Orden = 'atencion';
  soloDetenidas = false;
  vistaActual: Vista = 'equipos';
  visiblesEquipos = PAGINA_EQUIPOS;

  opcionesArea: Opcion<number>[] = [];
  readonly opcionesEstatus: Opcion<EstadoLista>[] = ESTADOS.map((e) => ({ label: ETIQUETA[e], value: e }));
  readonly opcionesOrden: Opcion<Orden>[] = [
    { label: 'Atención primero', value: 'atencion' },
    { label: 'Nombre', value: 'nombre' },
    { label: 'Menor avance', value: 'avance-asc' },
    { label: 'Mayor avance', value: 'avance-desc' },
    { label: 'Más detenidas', value: 'detenidas' },
    { label: 'Más pendientes', value: 'pendientes' },
  ];
  readonly opcionesVista: Opcion<Vista>[] = [
    { label: 'Equipos', value: 'equipos', icon: 'pi pi-users' },
    { label: 'Localidades', value: 'localidades', icon: 'pi pi-map-marker' },
    { label: 'Listas', value: 'listas', icon: 'pi pi-list' },
  ];

  atencionAbierta = true;
  private grupoEstado = new Map<number, { abierto: boolean; visibles: number }>();

  // ───────── Modales ─────────
  dlgEquipo = false;
  equipoSel: EquipoVM | null = null;
  listasEquipo: ListaVM[] = [];

  dlgLocalidad = false;
  localidadSel: LocalidadVM | null = null;

  dlgLista = { visible: false, cargando: false, data: null as HistorialLista | null, error: '' };

  private timer?: ReturnType<typeof setInterval>;
  private sub?: Subscription;
  private subLista?: Subscription;

  constructor(private inv: InventarioService) {}

  ngOnInit(): void {
    this.cargar();
    this.timer = setInterval(() => { if (--this.restante <= 0) this.cargar(); }, 1000);
  }

  ngOnDestroy(): void {
    if (this.timer) clearInterval(this.timer);
    this.sub?.unsubscribe();
    this.subLista?.unsubscribe();
  }

  // ═════════════════ CARGA ═════════════════

  cargar(): void {
    if (this.actualizando) return;
    this.actualizando = true;
    this.restante = REFRESCO_SEG;
    this.sub = this.inv.dashboard().subscribe({
      next: (d) => {
        this.data = d;
        this.error = '';
        this.preparar(d);
        this.loading = false;
        this.actualizando = false;
      },
      // Se conservan los últimos datos; solo se muestra el aviso
      error: (e) => { this.error = mensajeError(e); this.loading = false; this.actualizando = false; },
    });
  }

  /** Cálculos que no dependen de los filtros. Se ejecuta una vez por refresco. */
  private preparar(d: DashboardSnapshot): void {
    const codigoArea = new Map(d.porArea.map((a) => [a.id, a.codigo]));
    const up = (xs: (string | null | undefined)[]) => xs.filter(Boolean).join(' ').toUpperCase();

    this.nivelGlobal = this.nivel(d.global.avance, d.global.total);
    this.areas = d.porArea.map((a) => ({ ...a, nivel: this.nivel(a.avance, a.total) }));
    this.opcionesArea = d.porArea.map((a) => ({ label: `${a.codigo} · ${a.nombre}`, value: a.id }));
    if (this.filtroArea && !codigoArea.has(this.filtroArea)) this.filtroArea = null;

    this.equipos = d.porEquipo.map((e) => ({
      ...e,
      nivel: this.nivel(e.avance, e.total),
      texto: up([e.nombre, ...e.integrantes.map((i) => i.nombre), ...e.localidadesPlaneadas, ...e.listas.map((l) => l.folio)]),
    }));

    this.localidades = d.porLocalidad.map((l) => ({
      ...l,
      nivel: this.nivel(l.avance, l.total),
      texto: up([l.nombre, l.area, l.equipoPlaneado, ...l.equiposActuales, ...l.listas.map((x) => x.folio)]),
    }));

    this.listas = d.listas.map((l) => {
      const p = l.localidades.find((x) => x.principal) ?? l.localidades[0];
      return {
        ...l,
        principal: p?.nombre ?? '—',
        extra: Math.max(0, l.localidades.length - 1),
        areaCodigo: (l.areaId && codigoArea.get(l.areaId)) || '—',
        paso: ESTADOS.indexOf(l.estado),
        texto: up([l.folio, l.descripcion, l.equipoActual, l.equipoOriginal, ...l.localidades.map((x) => x.nombre)]),
      };
    });
    this.listaPorId = new Map(this.listas.map((l) => [l.id, l]));

    this.detenidasTop = [...d.alertas.detenidas]
      .sort((a, b) => (b.minutosEnEstado ?? 0) - (a.minutosEnEstado ?? 0))
      .slice(0, TOP_DETENIDAS);

    // Mantener modales abiertos con datos frescos
    if (this.equipoSel) {
      const e = this.equipos.find((x) => x.id === this.equipoSel!.id);
      if (e) this.abrirEquipo(e); else this.dlgEquipo = false;
    }
    if (this.localidadSel) this.localidadSel = this.localidades.find((x) => x.id === this.localidadSel!.id) ?? null;

    this.aplicar();
  }

  // ═════════════════ FILTROS ═════════════════

  aplicar(): void {
    const q = this.textoBusqueda.trim().toUpperCase();
    const est = this.filtroEstatus;
    const area = this.filtroArea;
    const codigo = area ? this.areas.find((a) => a.id === area)?.codigo ?? null : null;

    this.equiposFiltrados = this.ordenar(this.equipos.filter((e) =>
      (!q || e.texto.includes(q)) &&
      (!codigo || e.areas.includes(codigo)) &&
      (!est || e.porEstado[est] > 0) &&
      (!this.soloDetenidas || e.detenidas > 0)));
    this.equiposPagina = this.equiposFiltrados.slice(0, this.visiblesEquipos);

    const locs = this.ordenar(this.localidades.filter((l) =>
      (!q || l.texto.includes(q)) &&
      (!area || l.areaId === area) &&
      (!est || l.porEstado[est] > 0) &&
      (!this.soloDetenidas || l.detenidas > 0)));
    this.totalLocalidadesFiltradas = locs.length;
    this.gruposFiltrados = this.areas
      .map((a) => {
        const s = this.estadoGrupo(a.id);
        return {
          id: a.id, codigo: a.codigo, nombre: a.nombre, avance: a.avance, nivel: a.nivel,
          total: a.total, finalizadas: a.finalizadas, detenidas: a.detenidas,
          localidades: locs.filter((l) => l.areaId === a.id), abierto: s.abierto, visibles: s.visibles,
        };
      })
      .filter((g) => g.localidades.length);

    this.listasFiltradas = this.ordenarListas(this.listas.filter((l) =>
      (!q || l.texto.includes(q)) &&
      (!area || l.areaId === area) &&
      (!est || l.estado === est) &&
      (!this.soloDetenidas || l.detenida)));
  }

  private ordenar<T extends { nombre: string; avance: number; detenidas: number; pendientes: number }>(xs: T[]): T[] {
    const porNombre = (a: T, b: T) => a.nombre.localeCompare(b.nombre, 'es', { numeric: true });
    const cmp: Record<Orden, (a: T, b: T) => number> = {
      // Detenidas primero, luego menor avance: lo que más necesita decisión queda arriba.
      'atencion': (a, b) => b.detenidas - a.detenidas || a.avance - b.avance || porNombre(a, b),
      'nombre': porNombre,
      'avance-asc': (a, b) => a.avance - b.avance || porNombre(a, b),
      'avance-desc': (a, b) => b.avance - a.avance || porNombre(a, b),
      'detenidas': (a, b) => b.detenidas - a.detenidas || porNombre(a, b),
      'pendientes': (a, b) => b.pendientes - a.pendientes || porNombre(a, b),
    };
    return [...xs].sort(cmp[this.ordenActual]);
  }

  private ordenarListas(xs: ListaVM[]): ListaVM[] {
    const folio = (a: ListaVM, b: ListaVM) => a.folio.localeCompare(b.folio, 'es', { numeric: true });
    const min = (l: ListaVM) => l.minutosEnEstado ?? 0;
    const cmp: Record<Orden, (a: ListaVM, b: ListaVM) => number> = {
      'atencion': (a, b) => Number(b.detenida) - Number(a.detenida) || min(b) - min(a) || folio(a, b),
      'nombre': folio,
      'avance-asc': (a, b) => a.paso - b.paso || folio(a, b),
      'avance-desc': (a, b) => b.paso - a.paso || folio(a, b),
      'detenidas': (a, b) => Number(b.detenida) - Number(a.detenida) || min(b) - min(a),
      'pendientes': (a, b) => a.paso - b.paso || min(b) - min(a),
    };
    return [...xs].sort(cmp[this.ordenActual]);
  }

  limpiarFiltros(): void {
    this.filtroArea = null; this.filtroEstatus = null; this.textoBusqueda = ''; this.soloDetenidas = false;
    this.onFiltroCambio();
  }

  get hayFiltros(): boolean {
    return !!(this.filtroArea || this.filtroEstatus || this.textoBusqueda.trim() || this.soloDetenidas);
  }

  filtrarArea(id: number): void {
    this.filtroArea = this.filtroArea === id ? null : id;
    this.onFiltroCambio();
  }

  toggleDetenidas(): void {
    this.soloDetenidas = !this.soloDetenidas;
    this.onFiltroCambio();
  }

  verTodasDetenidas(): void {
    this.soloDetenidas = true;
    this.ordenActual = 'detenidas';
    this.vistaActual = 'listas';
    this.aplicar();
  }

  /** Cualquier cambio de filtro/orden/búsqueda vuelve la paginación de equipos a la primera página. */
  onFiltroCambio(): void {
    this.visiblesEquipos = PAGINA_EQUIPOS;
    this.aplicar();
  }

  verMasEquipos(): void {
    this.visiblesEquipos += PAGINA_EQUIPOS;
    this.equiposPagina = this.equiposFiltrados.slice(0, this.visiblesEquipos);
  }

  // ═════════════════ GRUPOS DE LOCALIDADES ═════════════════

  private estadoGrupo(id: number) {
    let s = this.grupoEstado.get(id);
    if (!s) { s = { abierto: true, visibles: PAGINA_LOCALIDADES }; this.grupoEstado.set(id, s); }
    return s;
  }
  toggleGrupo(g: GrupoVM): void { const s = this.estadoGrupo(g.id); s.abierto = !s.abierto; g.abierto = s.abierto; }
  verMas(g: GrupoVM): void { const s = this.estadoGrupo(g.id); s.visibles += PAGINA_LOCALIDADES; g.visibles = s.visibles; }

  // ═════════════════ MODALES ═════════════════

  abrirEquipo(e: EquipoVM): void {
    this.equipoSel = e;
    this.listasEquipo = e.listas
      .map((l) => this.listaPorId.get(l.id))
      .filter((l): l is ListaVM => !!l)
      .sort((a, b) => a.paso - b.paso || (b.minutosEnEstado ?? 0) - (a.minutosEnEstado ?? 0));
    this.dlgEquipo = true;
  }

  abrirLocalidad(l: LocalidadVM): void {
    this.localidadSel = l;
    this.dlgLocalidad = true;
  }

  abrirLista(id: number): void {
    this.dlgLista = { visible: true, cargando: true, data: null, error: '' };
    this.subLista?.unsubscribe();
    this.subLista = this.inv.detalleListaPublica(id).subscribe({
      next: (h) => { this.dlgLista.data = h; this.dlgLista.cargando = false; },
      error: (e) => { this.dlgLista.error = mensajeError(e); this.dlgLista.cargando = false; },
    });
  }

  // ═════════════════ AUXILIARES DE VISTA ═════════════════

  /** Nivel de color por avance: <25 rojo · <50 naranja · <100 azul · 100 verde. */
  nivel(avance: number, total: number): Nivel {
    if (!total) return 'none';
    if (avance >= 100) return 'green';
    if (avance >= 50) return 'blue';
    if (avance >= 25) return 'orange';
    return 'red';
  }

  pctEstado(e: EstadoLista): number {
    const t = this.data?.global.total ?? 0;
    return t ? Math.round(((this.data!.global.porEstado[e] ?? 0) / t) * 1000) / 10 : 0;
  }

  get enProceso(): number {
    const p = this.data?.global.porEstado;
    return p ? p.CONTEO + p.CAPTURA + p.VALIDACION : 0;
  }

  etiqueta(e: EstadoLista | string | null | undefined): string { return e ? ETIQUETA[e as EstadoLista] ?? e : '—'; }
  abrev(e: EstadoLista): string { return ABREV[e]; }
  general(e: EstadoGeneral | string): string { return GENERAL[e as EstadoGeneral] ?? e; }
  rol(r: string): string { return ROL[r] ?? r; }
  inicial(n: string): string { return (n || '?').trim().charAt(0).toUpperCase(); }
  minutosFase(e: EstadoLista): number | undefined { return this.dlgLista.data?.minutosPorEstado[e]; }

  tiempo(min: number | null | undefined): string {
    if (min === null || min === undefined) return '—';
    if (min < 60) return `${min} min`;
    return `${Math.floor(min / 60)} h ${String(min % 60).padStart(2, '0')} min`;
  }

  porId(_: number, x: { id: number }): number { return x.id; }
}
