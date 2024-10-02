import { Routes } from '@angular/router';
import { HomeComponent } from './components/home/home.component';
import { ModuloAsistenciaComponent } from './components/modulo-asistencia/modulo-asistencia.component';
import { LoginComponent } from './components/auth/login/login.component';
import { RegisterComponent } from './components/auth/register/register.component';
import { EvaluacionServiciosComponent } from './components/evaluacion-servicios/evaluacion-servicios.component';
import { NominasComponent } from './components/soporte-rh/nominas/nominas.component';
import { RetiroAhorroComponent } from './components/soporte-rh/retiro-ahorro/retiro-ahorro.component';

export const routes: Routes = [
    {
        path: '',
        component: HomeComponent,
        children: [
            { path: 'modulo_asistencia', component: ModuloAsistenciaComponent },
        ]
    },
    {path: 'login', component: LoginComponent },
    {path: 'register', component: RegisterComponent },
    {path:'evaluacion-servicios',component:EvaluacionServiciosComponent,
        children:[
            {path:'comedor',component:NominasComponent},
            {path:'transporte',component:RetiroAhorroComponent}
        ]
    }
];
