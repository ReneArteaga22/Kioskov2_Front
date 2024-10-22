import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

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


@Injectable({
  providedIn: 'root'
})
export class ApiService {
  url = 'http://localhost:3333';

  constructor(private http: HttpClient) { }

  ultimo_reporte(planta:string, reporte:any):Observable<any>{
    return this.http.post<any>(`${this.url}/api/reporte/reporte`,{planta, reporte})
  }

  login(userData: any): Observable<any> {
    return this.http.post<any>(`${this.url}/api/usuarios/login`, userData);
  }

  lista_usuarios():Observable<UsuariosResponse>{
    return this.http.get<UsuariosResponse>(`${this.url}/api/usuarios/index`)
  }

  buscar_usuario(userData:any):Observable<any>{
    return this.http.post<any>(`${this.url}/api/usuarios/buscar-usuario`,userData)
  }

  evaluar_servicio(userData:any):Observable<any>{
    return this.http.post<any>(`${this.url}/api/evaluacion/evaluar`,userData)
  }

  resultados_evaluacion_comedor():Observable<any>{
    return this.http.get<any>(`${this.url}/api/evaluacion/evaluaciones-comedor`)
  }

  resultados_evaluacion_transporte():Observable<any>{
    return this.http.get<any>(`${this.url}/api/evaluacion/evaluaciones-transporte`)
  }

  filtrar_resultados_comedor(userData:any):Observable<any>{
    return this.http.post<any>(`${this.url}/api/evaluacion/filtrar-comedor`, userData)
  }

  filtrar_resultados_transporte(userData:any):Observable<any>{
    return this.http.post<any>(`${this.url}/api/evaluacion/filtrar-transporte`, userData)
  }

  mostar_comentario_x_id(id:number):Observable<any>{
    return this.http.post<any>(`${this.url}/api/evaluacion/mostrar-comentario`,{id})
  }

  usuario_x_id(id:number):Observable<any>{
    return this.http.post<any>(`${this.url}/api/usuarios/usuario-id`,{id})
  }

  editar_usuario(id:number, usuario:any):Observable<any>{
    return this.http.put<any>(`${this.url}/api/usuarios/editar-usuario`, {id, usuario})
  }

  crear_reporte(userData:any):Observable<any>{
    return this.http.post<any>(`${this.url}/api/reporte/crear-reporte`,userData)
  }

  reportes():Observable<any>{
    return this.http.get<any>(`${this.url}/api/reporte/reportes`)
  }

  reporte_x_id(id:any):Observable<any>{
    return this.http.post<any>(`${this.url}/api/reporte/reporte_x_id`,{id})
  }

  filtrar_reporte(data:any):Observable<any>{
    return this.http.post<any>(`${this.url}/api/reporte/filtrar_reporte`,data)
  }

  actualizar_estado_reporte(id:any, estatus:string):Observable<any>{
    return this.http.post<any>(`${this.url}/api/reporte/actualizar_estado`,{id, estatus})
  }
}
