import { HttpClient, HttpErrorResponse, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, map } from 'rxjs';
import { ApiService } from './api.service';

// ───────── Catálogos ─────────
export type EstadoLista = 'SIN_ENTREGAR' | 'CONTEO' | 'CAPTURA' | 'VALIDACION' | 'FINALIZADO';
export const ESTADOS: EstadoLista[] = ['SIN_ENTREGAR', 'CONTEO', 'CAPTURA', 'VALIDACION', 'FINALIZADO'];

export type RolIntegrante =
  | 'CONTADOR' | 'AUDITOR_PISO' | 'HABILITADOR' | 'AUXILIAR'
  | 'CAPTURISTA' | 'VALIDACION' | 'SOLUCIONADOR' | 'AUDITOR_EXTERNO';

export type EstadoGeneral = 'SIN_LISTAS' | 'SIN_INICIAR' | 'EN_PROCESO' | 'ATENCION' | 'TERMINADO';

export interface Ajuste { positivo: number; negativo: number; neto: number; }

export interface Area { id: number; codigo: string; nombre: string; }
export interface Integrante { id: number; equipoId: number; nombreCompleto: string; rol: RolIntegrante; }
export interface Localidad {
  id: number; areaId: number; nombre: string; equipoPlaneadoId: number | null;
  area?: Area; equipoPlaneado?: Equipo | null; esPrincipal?: boolean;
}
export interface Equipo {
  id: number; nombre: string; activo: boolean;
  integrantes?: Integrante[]; localidadesPlaneadas?: Localidad[];
}
export interface Lista {
  id: number; folio: string; descripcion: string | null;
  estado: EstadoLista; estadoDesde: string; equipoActualId: number | null;
  ajustePositivo: number; ajusteNegativo: number; ajusteNeto: number; creadoEn: string;
  equipoActual?: Equipo | null; localidades?: Localidad[];
}
export interface LocalidadInput { localidadId: number; principal?: boolean; }

// ───────── Dashboard ─────────
export interface ListaDash {
  id: number; folio: string; descripcion: string | null;
  estado: EstadoLista; estadoDesde: string; minutosEnEstado: number | null; detenida: boolean;
  equipoActualId: number | null; equipoActual: string | null;
  equipoOriginalId: number | null; equipoOriginal: string | null; reasignada: boolean;
  localidadPrincipalId: number | null; areaId: number | null;
  localidades: { id: number; nombre: string; principal: boolean }[];
  ajuste: Ajuste;
}
export interface Agregado {
  total: number; finalizadas: number; pendientes: number; sinEntregar: number; detenidas: number;
  avance: number; porEstado: Record<EstadoLista, number>; ajuste: Ajuste;
}
export interface EquipoDash extends Agregado {
  id: number; nombre: string; activo: boolean;
  integrantes: { nombre: string; rol: RolIntegrante }[];
  areas: string[]; localidadesPlaneadas: string[];
  estadoGeneral: EstadoGeneral; puedeApoyar: boolean;
  recibidasDeOtros: number; cedidasAOtros: number; maxMinutosDetenida: number;
  listas: ListaDash[];
}
export interface LocalidadDash {
  id: number; nombre: string; areaId: number; area: string;
  equipoPlaneado: string | null; equiposActuales: string[];
  estado: EstadoLista | null; estadoGeneral: EstadoGeneral;
  total: number; finalizadas: number; pendientes: number; sinEntregar: number; detenidas: number;
  avance: number; porEstado: Record<EstadoLista, number>; ajuste: Ajuste;
  listas: { id: number; folio: string; estado: EstadoLista; equipoActual: string | null; detenida: boolean }[];
}
export interface AreaDash extends Agregado { id: number; codigo: string; nombre: string; estadoGeneral: EstadoGeneral; }

export interface DashboardSnapshot {
  generadoEn: string;
  umbralDetenidaMin: number;
  global: Agregado & { estadoGeneral: EstadoGeneral };
  alertas: {
    detenidas: ListaDash[];
    sinEntregar: ListaDash[];
    sinEquipo: ListaDash[];
    localidadesSinLista: { id: number; nombre: string; area: string }[];
    equiposQuePuedenApoyar: { id: number; nombre: string }[];
    equiposConMasPendientes: { id: number; nombre: string; pendientes: number; detenidas: number; avance: number }[];
    mayoresAjustes: ListaDash[];
  };
  cuellos: Record<'CONTEO' | 'CAPTURA' | 'VALIDACION', number>;
  porArea: AreaDash[];
  porEquipo: EquipoDash[];
  porLocalidad: LocalidadDash[];
  listas: ListaDash[];
}

export interface HistorialLista {
  lista: Lista & {
    asignaciones: { id: number; equipoId: number; inicio: string; fin: string | null; motivo: string | null; equipo: Equipo }[];
    transiciones: { id: number; estadoAnterior: EstadoLista | null; estadoNuevo: EstadoLista; fecha: string; comentario: string | null }[];
  };
  equipoOriginal: Equipo | null;
  minutosEnEstadoActual: number | null;
  minutosPorEstado: Partial<Record<EstadoLista, number>>;
}

export interface ResultadoReasignacion {
  reasignadas: { listaId: number; folio: string; equipoAnteriorId: number | null }[];
  omitidas: { listaId: number; folio: string; razon: string }[];
}
export interface ResultadoMasivo {
  exitosas: { listaId: number; folio: string }[];
  errores: { listaId: number; mensaje: string }[];
}

interface Resp<T> { success: boolean; titulo: string; mensaje: string; data: T; }

/** Extrae el mensaje del backend para mostrarlo en un toast. */
export function mensajeError(err: unknown): string {
  if (err instanceof HttpErrorResponse) {
    if (err.status === 0) return 'Sin conexión con el servidor';
    return err.error?.mensaje ?? `Error ${err.status}`;
  }
  return 'Error inesperado';
}

@Injectable({ providedIn: 'root' })
export class InventarioService {
  constructor(private http: HttpClient, private api: ApiService) {}

  /** Toma la URL de ApiService: se cambia en un solo lugar. */
  private get base() { return `${this.api.url}/inv`; }
  private get admin() { return `${this.base}/admin`; }

  private get<T>(url: string, params?: HttpParams): Observable<T> {
    return this.http.get<Resp<T>>(url, { params }).pipe(map((r) => r.data));
  }
  private send<T>(method: 'POST' | 'PUT' | 'PATCH' | 'DELETE', url: string, body: unknown = {}): Observable<Resp<T>> {
    return this.http.request<Resp<T>>(method, url, { body });
  }

  // ───────── Público ─────────
  dashboard(umbralMin?: number) {
    const params = umbralMin ? new HttpParams().set('umbral', umbralMin) : undefined;
    return this.get<DashboardSnapshot>(`${this.base}/dashboard`, params);
  }
  detalleListaPublica(id: number) { return this.get<HistorialLista>(`${this.base}/dashboard/listas/${id}`); }

  // ───────── Áreas ─────────
  areas() { return this.get<Area[]>(`${this.admin}/areas`); }
  crearArea(d: { codigo: string; nombre: string }) { return this.send<Area>('POST', `${this.admin}/areas`, d); }
  actualizarArea(id: number, d: Partial<Area>) { return this.send<Area>('PUT', `${this.admin}/areas/${id}`, d); }
  eliminarArea(id: number) { return this.send<null>('DELETE', `${this.admin}/areas/${id}`); }

  // ───────── Equipos e integrantes ─────────
  equipos() { return this.get<Equipo[]>(`${this.admin}/equipos`); }
  crearEquipo(d: { nombre: string; activo?: boolean }) { return this.send<Equipo>('POST', `${this.admin}/equipos`, d); }
  actualizarEquipo(id: number, d: Partial<Equipo>) { return this.send<Equipo>('PUT', `${this.admin}/equipos/${id}`, d); }
  eliminarEquipo(id: number) { return this.send<null>('DELETE', `${this.admin}/equipos/${id}`); }

  crearIntegrante(equipoId: number, d: { nombreCompleto: string; rol: RolIntegrante }) {
    return this.send<Integrante>('POST', `${this.admin}/equipos/${equipoId}/integrantes`, d);
  }
  actualizarIntegrante(id: number, d: Partial<Integrante>) { return this.send<Integrante>('PUT', `${this.admin}/integrantes/${id}`, d); }
  eliminarIntegrante(id: number) { return this.send<null>('DELETE', `${this.admin}/integrantes/${id}`); }

  // ───────── Localidades ─────────
  localidades(f: { areaId?: number; equipoId?: number } = {}) {
    let p = new HttpParams();
    if (f.areaId) p = p.set('areaId', f.areaId);
    if (f.equipoId) p = p.set('equipoId', f.equipoId);
    return this.get<Localidad[]>(`${this.admin}/localidades`, p);
  }
  crearLocalidad(d: { areaId: number; nombre: string; equipoPlaneadoId?: number | null }) {
    return this.send<Localidad>('POST', `${this.admin}/localidades`, d);
  }
  actualizarLocalidad(id: number, d: Partial<Localidad>) { return this.send<Localidad>('PUT', `${this.admin}/localidades/${id}`, d); }
  eliminarLocalidad(id: number) { return this.send<null>('DELETE', `${this.admin}/localidades/${id}`); }

  // ───────── Listas ─────────
  listas(f: { estado?: EstadoLista; equipoId?: number; localidadId?: number; areaId?: number; q?: string } = {}) {
    let p = new HttpParams();
    Object.entries(f).forEach(([k, v]) => { if (v !== undefined && v !== null && v !== '') p = p.set(k, String(v)); });
    return this.get<Lista[]>(`${this.admin}/listas`, p);
  }
  detalleLista(id: number) { return this.get<HistorialLista>(`${this.admin}/listas/${id}`); }

  /** Si no mandas equipoId, se asigna el equipo planeado de la localidad principal. */
  crearLista(d: { folio: string; descripcion?: string | null; equipoId?: number | null; localidades: LocalidadInput[] }) {
    return this.send<Lista>('POST', `${this.admin}/listas`, d);
  }
  actualizarLista(id: number, d: { folio?: string; descripcion?: string | null }) {
    return this.send<Lista>('PUT', `${this.admin}/listas/${id}`, d);
  }
  actualizarLocalidadesLista(id: number, localidades: LocalidadInput[]) {
    return this.send<Lista>('PUT', `${this.admin}/listas/${id}/localidades`, { localidades });
  }
  eliminarLista(id: number) { return this.send<null>('DELETE', `${this.admin}/listas/${id}`); }

  avanzar(id: number) { return this.send<Lista>('POST', `${this.admin}/listas/${id}/avanzar`); }
  /** Comentario obligatorio si es retroceso. */
  cambiarEstado(id: number, estado: EstadoLista, comentario?: string) {
    return this.send<Lista>('POST', `${this.admin}/listas/${id}/estado`, { estado, comentario });
  }
  estadoMasivo(listaIds: number[], estado: EstadoLista, comentario?: string) {
    return this.send<ResultadoMasivo>('POST', `${this.admin}/listas/estado-masivo`, { listaIds, estado, comentario });
  }
  /** Montos en valor absoluto: sobrante 500, faltante 1200. */
  registrarAjuste(id: number, sobrante: number, faltante: number) {
    return this.send<Lista>('PATCH', `${this.admin}/listas/${id}/ajuste`, { sobrante, faltante });
  }

  reasignar(listaIds: number[], equipoId: number, motivo: string) {
    return this.send<ResultadoReasignacion>('POST', `${this.admin}/listas/reasignar`, { listaIds, equipoId, motivo });
  }
  reasignarLocalidad(localidadId: number, equipoId: number, motivo: string) {
    return this.send<ResultadoReasignacion>('POST', `${this.admin}/listas/reasignar-localidad`, { localidadId, equipoId, motivo });
  }
  reasignarEquipo(origenId: number, destinoId: number, motivo: string, estados?: EstadoLista[]) {
    return this.send<ResultadoReasignacion>('POST', `${this.admin}/listas/reasignar-equipo`, { origenId, destinoId, motivo, estados });
  }
}