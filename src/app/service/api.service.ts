import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';

interface LoginResponse{
  usuarios: Usuario,
  area:string;
}

export interface Usuario {
  id: number;
  nombre: string;
  apellidos: string;
  usuario: string;
  area: string;
  idRol:string;
}

export interface UsuariosResponse {
  title: string;
  usuarios: Usuario[];
}

export interface Avance {
  userId: number;
  porcentajeAvance: number
}
export interface Amonestacion {
  id?: number
  fecha: string
  hora: string
  planta: string
  departamento: string
  noEmpleado: string
  nombre: string
  puesto: string
  reporta: string
  motivo: string
  year?: number
  ts?: number
}

export interface ResumenEmpleado {
  no_empleado: string
  nombre: string
  planta: string
  departamento: string
  conteo: number
  last_fecha: string
  semaforo: 'verde' | 'amarillo' | 'rojo'
}

export interface Kpis {
  year: number
  total: number
  red: number
  yellow: number
  green: number
}

export interface FiltrosAmonestaciones {
  q?: string
  planta?: string
  year?: number
}

export interface Empleado {
  noEmpleado:   string
  nombre:       string
  puesto:       string
  departamento: string
  planta:       string
  turno:        string
  matx3:        string
  activo:       string
}


@Injectable({
  providedIn: 'root'
})
export class ApiService {
  //url = 'http://10.38.12.4:3333/api';
  url = 'http://localhost:3333/api';

  constructor(private http: HttpClient) { }

  ultimo_reporte(planta:string, reporte:any):Observable<any>{
    return this.http.post<any>(`${this.url}/reporte/reporte`,{planta, reporte})
  }

  register(data:any):Observable<any>{
    return this.http.post<any>(`${this.url}/usuarios/register`,data)
  }

  login(userData: any): Observable<any> {
    return this.http.post<any>(`${this.url}/usuarios/login`, userData);
  }

  lista_usuarios():Observable<UsuariosResponse>{
    return this.http.get<UsuariosResponse>(`${this.url}/usuarios/index`)
  }

  buscar_usuario(userData:any):Observable<any>{
    return this.http.post<any>(`${this.url}/usuarios/buscar-usuario`,userData)
  }

  evaluar_servicio(userData:any):Observable<any>{
    return this.http.post<any>(`${this.url}/evaluacion/evaluar`,userData)
  }

  resultados_evaluacion_comedor():Observable<any>{
    return this.http.get<any>(`${this.url}/evaluacion/evaluaciones-comedor`)
  }

  resultados_evaluacion_limpieza():Observable<any>{
    return this.http.get<any>(`${this.url}/evaluacion/evaluaciones-limpieza`)
  }

  resultados_evaluacion_transporte():Observable<any>{
    return this.http.get<any>(`${this.url}/evaluacion/evaluaciones-transporte`)
  }

  resultados_evaluacion_enfermeria():Observable<any>{
    return this.http.get<any>(`${this.url}/evaluacion/evaluaciones-enfermeria`)
  }

  filtrar_resultados_limpieza(filtro: any) {
    console.log('Enviando datos al servidor:', filtro); // Verifica los datos que se envían
    return this.http.post<any>(`${this.url}/evaluacion/filtrar-limpieza`, filtro);
  }

  filtrar_resultados_comedor(filtro: any) {
    console.log('Enviando datos al servidor:', filtro); // Verifica los datos que se envían
    return this.http.post<any>(`${this.url}/evaluacion/filtrar-comedor`, filtro);
  }

  filtrar_resultados_transporte(userData:any):Observable<any>{
    return this.http.post<any>(`${this.url}/evaluacion/filtrar-transporte`, userData)
  }

  filtrar_resultados_enfermeria(userData:any):Observable<any>{
    return this.http.post<any>(`${this.url}/evaluacion/filtrar-enfermeria`, userData)
  }

  mostar_comentario_x_id(id:number):Observable<any>{
    return this.http.post<any>(`${this.url}/evaluacion/mostrar-comentario`,{id})
  }

  usuario_x_id(id:any):Observable<any>{
    return this.http.post<any>(`${this.url}/usuarios/usuario-id`,{id})
  }

  editar_usuario(id:any, usuario:any):Observable<any>{
    return this.http.put<any>(`${this.url}/usuarios/editar-usuario/${id}`, {usuario})
  }

  modificar_estado(id:any, estatus:any):Observable<any>{
    return this.http.put<any>(`${this.url}/usuarios/modificar_estado/${id}`, {estatus})
  }

  reportes():Observable<any>{
    return this.http.get<any>(`${this.url}/reporte/reportes`)
  }

  reporte_x_id(id:any):Observable<any>{
    return this.http.post<any>(`${this.url}/reporte/reporte_x_id`,{id})
  }

  filtrar_reporte(data:any):Observable<any>{
    return this.http.post<any>(`${this.url}/reporte/filtrar_reporte`,data)
  }

  actualizar_estado_reporte(id:any, estatus:string):Observable<any>{
    return this.http.post<any>(`${this.url}/reporte/actualizar_estado`,{id, estatus})
  }

  comunicados():Observable<any>{
    return this.http.get<any>(`${this.url}/comunicado/comunicados`)
  }

  crear_sugerencia(data:any):Observable<any>{
    return this.http.post<any>(`${this.url}/sugerencia/crear_sugerencia`,data)
  }

  sugerencias():Observable<any>{
    return this.http.get<any>(`${this.url}/sugerencia/sugerencias`)
  }

  eliminar_comunicado(id:any):Observable<any>{
    return this.http.delete<any>(`${this.url}/comunicado/eliminar_comunicado/${id}`)
  }

  // agregar_comunicado(data:any):Observable<any>{
  //   return this.http.post<any>(`${this.url}/comunicado/agregar_comunicado`,data)
  // }

  menu_comunicado():Observable<any>{
    return this.http.get<any>(`${this.url}/comunicado/menu_comunicado`)
  }

  foto():Observable<any>{
    return this.http.get<any>(`${this.url}/comunicado/img`)
  }
  
  agregar_comunicado(formData: FormData): Observable<any> {
    return this.http.post<any>(`${this.url}/comunicado/agregar_comunicado`, formData);
  }
  
  agregar_menu(formData: FormData): Observable<any> {
    return this.http.post<any>(`${this.url}/comunicado/agregar_comunicado`, formData);
  }

  lista_comunicados():Observable<any>{
    return this.http.get<any>(`${this.url}/comunicado/lista_comunicados`)
  }

  cambiar_contrasena(id:any, contrasena:string):Observable<any>{
    return this.http.put<any>(`${this.url}/usuarios/recuperar-contrasena`,{id, contrasena})
  }

  reportes_seguridad():Observable<any>{
    return this.http.get<any>(`${this.url}/reporte_seguridad/reportes`)
  }

  filtrar_reporte_seguridad(filtro:any):Observable<any>{
    console.log('Enviando datos al servidor', filtro)
    return this.http.post<any>(`${this.url}/reporte_seguridad/filtrar_reporte_seguridad`, filtro)
  }

  reporte_acoso_y_acto_inseguro(data:any):Observable<any>{
    return this.http.post<any>(`${this.url}/email/reporte_acoso_y_acto_inseguro`,data)
  }
  
  reporte_soporte_recursos_humanos(data:any):Observable<any>{
    return this.http.post<any>(`${this.url}/email/reporte_soporte_recursos_humanos`,data)
  }

  dashboard_avances():Observable<any>{
    return this.http.get<any>(`${this.url}/avances/ver`)
  }
  avanceInventario(avance:Avance):Observable<{msg:string; data:Avance}>{
    return this.http.post<{msg:string;data:Avance}>(`${this.url}/avances/registrar`, avance);
  }
  getDashboardInventario(): Observable<any> {
    return this.http.get<any>(`${this.url}/dashboard/inventario`);
  }
  // Obtener todas las localidades (para llenar la tabla)
  getLocalidades() {
    return this.http.get(`${this.url}/localidades`);
  }

  // Actualizar una localidad (usa tu endpoint PATCH existente)
  updateLocalidadEstatus(id: number, data: any) {
    return this.http.patch(`${this.url}/localidades/${id}/estatus`, data);
  }
  getAmonestaciones(filtros: FiltrosAmonestaciones = {}): Observable<Amonestacion[]> {
    let params = new HttpParams();
    if (filtros.q)      params = params.set('q', filtros.q);
    if (filtros.planta) params = params.set('planta', filtros.planta);
    if (filtros.year)   params = params.set('year', String(filtros.year));
    return this.http.get<Amonestacion[]>(`${this.url}/amonestaciones`, { params });
  }

  getAmonestacionesKpis(year: number): Observable<Kpis> {
    return this.http.get<Kpis>(`${this.url}/amonestaciones/kpis`, {
      params: new HttpParams().set('year', String(year))
    });
  }

  getAmonestacionesResumen(year: number): Observable<ResumenEmpleado[]> {
    return this.http.get<ResumenEmpleado[]>(`${this.url}/amonestaciones/resumen`, {
      params: new HttpParams().set('year', String(year))
    });
  }

  getAmonestacionesYears(): Observable<number[]> {
    return this.http.get<number[]>(`${this.url}/amonestaciones/years`);
  }

  createAmonestacion(data: Amonestacion): Observable<{ record: Amonestacion; alerta: boolean; totalAnio: number }> {
    return this.http.post<any>(`${this.url}/amonestaciones`, data);
  }

  updateAmonestacion(id: number, data: Amonestacion): Observable<Amonestacion> {
    return this.http.put<Amonestacion>(`${this.url}/amonestaciones/${id}`, data);
  }

  deleteAmonestacion(id: number): Observable<void> {
    return this.http.delete<void>(`${this.url}/amonestaciones/${id}`);
  }

  exportAmonestacionesJSON(): Observable<any> {
    return this.http.get(`${this.url}/amonestaciones/export`);
  }

  buscarEmpleados(q: string): Observable<Empleado[]> {
  return this.http
    .get<{ status: string; data: Empleado[] }>(`${this.url}/empleados`, {
      params: new HttpParams().set('q', q)
    })
    .pipe(map(res => res.data))
}

getEmpleado(noEmpleado: string): Observable<Empleado> {
  return this.http
    .get<{ status: string; data: Empleado }>(`${this.url}/empleados/${noEmpleado}`)
    .pipe(map(res => res.data))
}
}