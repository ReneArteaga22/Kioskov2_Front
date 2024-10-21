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
import { UsuariosComponent } from './views/usuarios/usuarios.component';
import { ResultadosEvaluacionComponent } from './views/evaluacion/resultados-evaluacion-comedor/resultados-evaluacion.component';
import { TablasServiciosComponent } from './views/evaluacion/tablas-servicios/tablas-servicios.component';
import { ResultadosEvaluacionTransporteComponent } from './views/evaluacion/resultados-evaluacion-transporte/resultados-evaluacion-transporte.component';
import { SoporteRhComponent } from './views/soporte-rh/soporte-rh.component';
import { NominasComponent } from './views/soporte-rh/nominas/nominas.component';
import { RetiroAhorroComponent } from './views/soporte-rh/retiro-ahorro/retiro-ahorro.component';
import { SolicitudGafeteComponent } from './views/soporte-rh/solicitud-gafete/solicitud-gafete.component';
import { ConsultarVacacionesComponent } from './views/soporte-rh/consultar-vacaciones/consultar-vacaciones.component';
import { UsuariosInfoComponent } from './views/usuarios/usuarios-info/usuarios-info.component';
import { SolicitudesComponent } from './views/solicitudes/solicitudes.component';

export const routes: Routes = [
  {
    path: '',
    component: HomeComponent,
    children: [
     
    ]
  },
  { path: 'modulo_asistencia', component: ModuloAsistenciaComponent },
  { path: 'comedor', component: ComedorComponent },
  { path: 'transporte', component: TransporteComponent },
  { path: 'servicios', component: EvaluacionServiciosComponent },
  { path: 'resultados-evaluacion-comedor', component: ResultadosEvaluacionComponent },
  { path: 'resultados-evaluacion-transporte',component:ResultadosEvaluacionTransporteComponent},
  { path: 'usuarios', component: UsuariosComponent },
  { path: 'recuperar-contrasena', component: RecuperarContrasenaComponent },
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  { path: 'home-prueba', component: ReconocimientosComponent },
  { path: 'tablas-servicios',component:TablasServiciosComponent},
  { path: 'soporte-rh-modulos',component:SoporteRhComponent},
  { path: 'nomina',component:NominasComponent},
  { path: 'retiro-ahorro',component:RetiroAhorroComponent},
  { path: 'solicitud-gafete',component:SolicitudGafeteComponent},
  { path: 'consultar-vacaciones',component:ConsultarVacacionesComponent},
  { path: 'usuarios-info',component:UsuariosInfoComponent},
  { path: 'solicitudes',component:SolicitudesComponent}
]