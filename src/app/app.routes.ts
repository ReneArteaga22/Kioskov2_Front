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
import { SolicitudComponent } from './views/solicitudes/solicitud/solicitud.component';
import { ComunicadosComponent } from './views/comunicados/comunicados.component';
import { guardGuard } from './service/guard.guard';
import { rhGuard } from './service/rh.guard';
import { BuzonComponent } from './views/buzon/buzon.component';
import { SugerenciasComponent } from './views/sugerencias/sugerencias.component';
import { ComunicadoComponent } from './views/comunicado/comunicado.component';
import { comedorGuard } from './service/comedor.guard';
import { ComedorGuestComponent } from './views/evaluacion/comedor-guest/comedor-guest.component';
import { LimpiezaGuestComponent } from './views/evaluacion/limpieza-guest/limpieza-guest.component';
import { ResultadosEvaluacionLimpiezaComponent } from './views/evaluacion/resultados-evaluacion-limpieza/resultados-evaluacion-limpieza.component';
import { SeguridadComponent } from './views/seguridad/seguridad.component';
import { ActosInsegurosComponent } from './views/seguridad/actos-inseguros/actos-inseguros.component';
import { AcosoComponent } from './views/seguridad/acoso/acoso.component';
import { DirectorioComponent } from './views/directorio/directorio.component';
import { ReportesSeguridadComponent } from './views/seguridad/reportes-seguridad/reportes-seguridad.component';
import { EncuestasComponent } from './views/encuestas/encuestas.component';
import { EnfermeriaComponent } from './views/enfermeria/enfermeria.component';
import { ConsultaMedicaComponent } from './views/soporte-rh/consulta-medica/consulta-medica.component';
import { ResultadosEvaluacionEnfermeriaComponent } from './views/evaluacion/resultados-evaluacion-enfermeria/resultados-evaluacion-enfermeria.component';
import { AvanceComponent } from './views/inventario/avance/avance.component';

export const routes: Routes = [
  { path: '',component: HomeComponent},
  { path: 'modulo_asistencia', component: ModuloAsistenciaComponent,canActivate:[rhGuard] },
  { path: 'comedor', component: ComedorComponent,canActivate:[comedorGuard] },
  { path: 'transporte', component: TransporteComponent, },
  { path: 'servicios', component: EvaluacionServiciosComponent, },
  { path: 'resultados-evaluacion-comedor', component: ResultadosEvaluacionComponent,canActivate:[rhGuard] },
  { path: 'resultados-evaluacion-transporte',component:ResultadosEvaluacionTransporteComponent,canActivate:[rhGuard]},
  { path: 'resultados-evaluacion-enfermeria',component:ResultadosEvaluacionEnfermeriaComponent,canActivate:[rhGuard]},
  { path: 'usuarios', component: UsuariosComponent,canActivate:[rhGuard] },
  { path: 'recuperar-contrasena', component: RecuperarContrasenaComponent,},
  { path: 'login', component: LoginComponent,canActivate:[guardGuard] },
  { path: 'register', component: RegisterComponent,canActivate:[rhGuard] },
  { path: 'reconocimientos', component: ReconocimientosComponent},
  { path: 'tablas-servicios',component:TablasServiciosComponent,canActivate:[rhGuard]},
  { path: 'soporte-rh-modulos',component:SoporteRhComponent,},
  { path: 'nomina',component:NominasComponent,},
  { path: 'retiro-ahorro',component:RetiroAhorroComponent,},
  { path: 'solicitud-gafete',component:SolicitudGafeteComponent,},
  { path: 'consultar-vacaciones',component:ConsultarVacacionesComponent,},
  { path: 'usuarios-info',component:UsuariosInfoComponent,canActivate:[rhGuard]},
  { path: 'comunicados',component:ComunicadosComponent,canActivate:[rhGuard]},
  { path: 'solicitudes',component:SolicitudesComponent,canActivate:[rhGuard]}, 
  { path: 'solicitud',component:SolicitudComponent,},
  { path: 'buzon',component:BuzonComponent,canActivate:[]},
  { path: 'sugerencias',component:SugerenciasComponent,canActivate:[rhGuard]},
  { path: 'comunicado',component:ComunicadoComponent,canActivate:[]},
  { path: 'comedor-guest',component:ComedorGuestComponent},
  { path: 'limpieza-guest',component:LimpiezaGuestComponent},
  { path: 'seguridad',component:SeguridadComponent,canActivate:[]},
  { path: 'actos-inseguros',component:ActosInsegurosComponent,canActivate:[]},
  { path: 'acoso',component:AcosoComponent,canActivate:[]},
  { path: 'resultados-evaluacion-limpieza',component:ResultadosEvaluacionLimpiezaComponent,canActivate:[rhGuard]},
  { path: 'directorio', component:DirectorioComponent,canActivate:[]},
  { path: 'reportes-seguridad',component:ReportesSeguridadComponent,canActivate:[rhGuard]},
  { path: 'encuestas',component:EncuestasComponent,canActivate:[]},
  { path: 'enfermeria', component:EnfermeriaComponent,canActivate:[]},
  { path: 'consulta-medica',component:ConsultaMedicaComponent,canActivate:[]},
  { path: 'avance',component:AvanceComponent,canActivate:[]}

]