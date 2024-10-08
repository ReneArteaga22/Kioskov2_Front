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

  login(userData: any): Observable<any> {
    return this.http.post<any>(`${this.url}/api/usuarios/login`, userData);
  }

  lista_usuarios():Observable<UsuariosResponse>{
    return this.http.get<UsuariosResponse>(`${this.url}/api/usuarios/index`)
  }

  buscar_usuario(userData:any):Observable<UsuariosResponse>{
    return this.http.post<UsuariosResponse>(`${this.url}/api/usuarios/buscar-usuario`,userData)
  }

  evaluar_servicio(userData:any):Observable<any>{
    return this.http.post<any>(`${this.url}/api/evaluacion/evaluar`,userData)
  }

  resultados_evaluacion_comedor():Observable<any>{
    return this.http.get<any>(`${this.url}/api/evaluacion/evaluaciones-comedor`)
  }
}
