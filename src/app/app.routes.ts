import { Routes } from '@angular/router';
import { HomeComponent } from './components/home/home.component';
import { ModuloAsistenciaComponent } from './components/modulo-asistencia/modulo-asistencia.component';
import { LoginComponent } from './components/auth/login/login.component';
import { RegisterComponent } from './components/auth/register/register.component';
import { SoporteRhComponent } from './components/soporte-rh/soporte-rh.component';
import { NominasComponent } from './components/soporte-rh/nominas/nominas.component';
import { RetiroAhorroComponent } from './components/soporte-rh/retiro-ahorro/retiro-ahorro.component';
import { SolicitudGafeteComponent } from './components/soporte-rh/solicitud-gafete/solicitud-gafete.component';

export const routes: Routes = [
    {
        path: '',
        component: HomeComponent,
        children: [
            { path: 'modulo_asistencia', component: ModuloAsistenciaComponent },
            { 
                path: 'soporte-rh', 
                component: SoporteRhComponent, 
                children: [
                    {path:'nominas',component: NominasComponent },
                    {path:'retiro-ahorro',component:RetiroAhorroComponent},
                    {path:'solicitud-gafete',component:SolicitudGafeteComponent}
                ]
            }
        ]
    },
    { path: 'login', component: LoginComponent },
    { path: 'register', component: RegisterComponent }
];
