import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

interface LoginResponse{
}

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  url = 'http://127.0.0.1:3333'

  constructor(private http: HttpClient) { }

  login(userData:any):Observable<LoginResponse>{
    return this.http.post<LoginResponse>(`${this.url}/api/auth/login`,userData)
  }
}
