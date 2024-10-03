import { Routes } from '@angular/router';
import { HomeComponent } from './views/home/home.component';
import { ModuloAsistenciaComponent } from './views/modulo-asistencia/modulo-asistencia.component';
import { EvaluacionServiciosComponent } from './views/evaluacion/evaluacion-servicios/evaluacion-servicios.component';
import { TransporteComponent } from './views/evaluacion/transporte/transporte.component';
import { ComedorComponent } from './views/evaluacion/comedor/comedor.component';
import { ReconocimientosComponent } from './views/reconocimientos/reconocimientos.component';
import { RecuperarContrasenaComponent } from './views/auth/recuperar-contrasena/recuperar-contrasena.component';
import { LoginComponent } from './views/auth/login/login.component';
import { RegisterComponent } from './views/auth/register/register.component';



export const routes: Routes = [
    {
        path: '',
        component: HomeComponent,
        children: [
            { path: 'modulo_asistencia', component: ModuloAsistenciaComponent },
        ]
    },
    {path:'recuperar-contrasena',component:RecuperarContrasenaComponent},
    {path:'comedor',component:ComedorComponent},
    {path:'transporte',component:TransporteComponent},
    {path:'servicios',component:EvaluacionServiciosComponent},
    {path:'login', component: LoginComponent },
    {path:'register', component: RegisterComponent },
    {path:'home-prueba',component:ReconocimientosComponent}
];
