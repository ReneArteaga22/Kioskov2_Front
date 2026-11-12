import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map } from 'rxjs';

// ⚠️ Usa la MISMA base que tu InventarioService (puerto/host)
const API = 'http://localhost:3333/api/inv/admin';

export interface Area { id: number; codigo: string; nombre: string; activo?: boolean; }
export interface Integrante { id: number; equipoId: number; nombreCompleto: string; rol: string; }
export interface EquipoCat { id: number; nombre: string; activo: boolean; integrantes?: Integrante[]; }
export interface LocalidadCat {
  id: number; areaId: number; nombre: string; equipoPlaneadoId: number | null;
  area?: Area; equipoPlaneado?: { id: number; nombre: string } | null;
}
export interface Resp<T = unknown> { mensaje: string; data: T; }

/** Acepta respuesta como arreglo o como { data: [...] } */
const arr = <T>(r: any): T[] => (Array.isArray(r) ? r : r?.data ?? []);

@Injectable({ providedIn: 'root' })
export class InvCatalogosService {
  constructor(private http: HttpClient) {}

  // Áreas
  areas(): Observable<Area[]> { return this.http.get<any>(`${API}/areas`).pipe(map(arr<Area>)); }
  crearArea(b: Partial<Area>) { return this.http.post<Resp>(`${API}/areas`, b); }
  editarArea(id: number, b: Partial<Area>) { return this.http.put<Resp>(`${API}/areas/${id}`, b); }
  eliminarArea(id: number) { return this.http.delete<Resp>(`${API}/areas/${id}`); }

  // Equipos
  equipos(): Observable<EquipoCat[]> { return this.http.get<any>(`${API}/equipos`).pipe(map(arr<EquipoCat>)); }
  crearEquipo(b: Partial<EquipoCat>) { return this.http.post<Resp>(`${API}/equipos`, b); }
  editarEquipo(id: number, b: Partial<EquipoCat>) { return this.http.put<Resp>(`${API}/equipos/${id}`, b); }
  eliminarEquipo(id: number) { return this.http.delete<Resp>(`${API}/equipos/${id}`); }

  // Integrantes
  crearIntegrante(equipoId: number, b: { nombreCompleto: string; rol: string }) {
    return this.http.post<Resp>(`${API}/equipos/${equipoId}/integrantes`, b);
  }
  editarIntegrante(id: number, b: Partial<Integrante>) { return this.http.put<Resp>(`${API}/integrantes/${id}`, b); }
  eliminarIntegrante(id: number) { return this.http.delete<Resp>(`${API}/integrantes/${id}`); }

  // Localidades
  localidades(): Observable<LocalidadCat[]> { return this.http.get<any>(`${API}/localidades`).pipe(map(arr<LocalidadCat>)); }
  crearLocalidad(b: { areaId: number; nombre: string; equipoPlaneadoId: number | null }) {
    return this.http.post<Resp>(`${API}/localidades`, b);
  }
  editarLocalidad(id: number, b: Partial<LocalidadCat>) { return this.http.put<Resp>(`${API}/localidades/${id}`, b); }
  eliminarLocalidad(id: number) { return this.http.delete<Resp>(`${API}/localidades/${id}`); }
}
