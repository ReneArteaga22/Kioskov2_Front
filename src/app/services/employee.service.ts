import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class EmployeeService {
  private apiUrl = 'http://10.99.22.17:3333';
  constructor(private http: HttpClient) { }

  getEmployees(): Observable<any>
  { 
     return this.http.get<any>(`${this.apiUrl}/api/usuarios/employees`)
  }

  directorio(): Observable<any>{
    return this.http.get<any>(`${this.apiUrl}/api/usuarios/directorio`)
  }
}
