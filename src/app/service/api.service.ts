import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

interface LoginResponse {
  // Define the structure of your login response here
}

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  url = 'http://localhost:3333';

  constructor(private http: HttpClient) { }

  login(userData: any): Observable<LoginResponse> {
    return this.http.post<LoginResponse>(`${this.url}/api/usuarios/login`, userData);
  }
}
