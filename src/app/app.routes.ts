//importamos RouterModule
import { RouterModule, Routes } from '@angular/router';

//importamos los componentes
import { LoginComponent } from './components/login/login.component';
import { HomeComponent } from './components/home/home.component';
import { MedicosComponent } from './components/admin/medicos.component';
import { AdminPanelComponent } from './components/admin/admin-panel.component';
import { PasesComponent } from './components/pacientes/pases.component';
import { AyudaComponent } from './components/ayuda/ayuda.component';
import { UsuariosComponent } from "./components/admin/usuarios.component";
import { AjustesUsuarioComponent } from './components/admin/ajustes-usuario.component';

//importamos servicios
import { AuthService } from "./services/auth.service";

const APP_ROUTES: Routes = [
  { path: '',
    component: LoginComponent,
    data: { title: 'Login' }
  },
  {
    path: 'inicio',
    component: HomeComponent,
    data: { title: 'Bienvenido' },
    canActivate: [AuthService]
  },
  {
    path: 'generaorden',
    component: PasesComponent,
    data: { title: 'Emisión de órdenes' },
    canActivate: [AuthService]
  },
  {
    path: 'ayuda',
    component: AyudaComponent,
    data: { title: 'Ayuda' },
    canActivate: [AuthService]
  },
  {
    path: 'administracion',
    component: AdminPanelComponent,
    data: { title: 'Administración' },
    canActivate: [AuthService]
  },
  {
    path: 'medicos',
    component: MedicosComponent,
    data: { title: 'Médicos' },
    canActivate: [AuthService]
  },
  {
    path: 'usuarios',
    component: UsuariosComponent,
    data: { title: 'Usuarios' },
    canActivate: [AuthService]
  },
  {
    path: 'perfil',
    component: AjustesUsuarioComponent,
    data: { title: 'Perfil' },
    canActivate: [AuthService]
  },
  {
    path: '**',
    pathMatch:'full',
    redirectTo: 'login'
  },
  {
    path: '',
    pathMatch:'full',
    redirectTo: 'login'
  }
];

export const APP_ROUTING = RouterModule.forRoot(APP_ROUTES);
