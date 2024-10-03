import { Routes } from '@angular/router';
import { HomeComponent } from './components/home/home.component';
import { ModuloAsistenciaComponent } from './components/modulo-asistencia/modulo-asistencia.component';
import { LoginComponent } from './components/auth/login/login.component';
import { RegisterComponent } from './components/auth/register/register.component';
import { EvaluacionServiciosComponent } from './components/evaluacion-servicios/evaluacion-servicios.component';
import { TransporteComponent } from './components/evaluacion-servicios/servicios/transporte/transporte.component';
import { ComedorComponent } from './components/evaluacion-servicios/servicios/comedor/comedor.component';
import { ReconocimientosComponent } from './components/reconocimientos/reconocimientos.component';

export const routes: Routes = [
    {
        path: '',
        component: HomeComponent,
        children: [
            { path: 'modulo_asistencia', component: ModuloAsistenciaComponent },
        ]
    },
    {path:'comedor',component:ComedorComponent},
    {path:'transporte',component:TransporteComponent},
    {path:'servicios',component:EvaluacionServiciosComponent},
    {path:'login', component: LoginComponent },
    {path:'register', component: RegisterComponent },
    {path:'home-prueba',component:ReconocimientosComponent}
];
