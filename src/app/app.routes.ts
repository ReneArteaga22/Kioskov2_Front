import { Routes } from '@angular/router';
import { HomeComponent } from './components/home/home.component';
import { ModuloAsistenciaComponent } from './components/modulo-asistencia/modulo-asistencia.component';
import { LoginComponent } from './components/auth/login/login.component';
import { RegisterComponent } from './components/auth/register/register.component';
import { EvaluacionServiciosComponent } from './components/evaluacion-servicios/evaluacion-servicios.component';
<<<<<<< HEAD
import { NominasComponent } from './components/soporte-rh/nominas/nominas.component';
import { RetiroAhorroComponent } from './components/soporte-rh/retiro-ahorro/retiro-ahorro.component';
=======
import { TransporteComponent } from './components/evaluacion-servicios/servicios/transporte/transporte.component';
import { ComedorComponent } from './components/evaluacion-servicios/servicios/comedor/comedor.component';
>>>>>>> 9b33de6e23db53c4d8c0f2196e61813506e33a96

export const routes: Routes = [
    {
        path: '',
        component: HomeComponent,
        children: [
            { path: 'modulo_asistencia', component: ModuloAsistenciaComponent },
        ]
    },
<<<<<<< HEAD
    {path: 'login', component: LoginComponent },
    {path: 'register', component: RegisterComponent },
    {path:'evaluacion-servicios',component:EvaluacionServiciosComponent,
        children:[
            {path:'comedor',component:NominasComponent},
            {path:'transporte',component:RetiroAhorroComponent}
        ]
    }
=======
    {path:'comedor',component:ComedorComponent},
    {path:'transporte',component:TransporteComponent},
    {path:'servicios',component:EvaluacionServiciosComponent},
    {path:'login', component: LoginComponent },
    {path:'register', component: RegisterComponent }
>>>>>>> 9b33de6e23db53c4d8c0f2196e61813506e33a96
];
