import { Routes } from '@angular/router';
import { HomeComponent } from './components/home/home.component';
import { ModuloAsistenciaComponent } from './components/modulo-asistencia/modulo-asistencia.component';

export const routes: Routes = [
    {path:'',component:HomeComponent,canActivate:[]},
    {path:'modulo_asistencia',component:ModuloAsistenciaComponent,canActivate:[]}
];
