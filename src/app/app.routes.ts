import { Routes } from '@angular/router';
import { HomeComponent } from './components/home/home.component';
import { ModuloAsistenciaComponent } from './components/modulo-asistencia/modulo-asistencia.component';
import { LoginComponent } from './components/login/login.component';
import { RegisterComponent } from './components/register/register.component';

export const routes: Routes = [
    {path:'',component:HomeComponent,canActivate:[]},
    {path:'login',component:LoginComponent,canActivate:[]},
    {path:'register',component:RegisterComponent,canActivate:[]},
    {path:'modulo_asistencia',component:ModuloAsistenciaComponent,canActivate:[]}
];
