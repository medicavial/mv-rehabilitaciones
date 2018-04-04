//importamos RouterModule
import { RouterModule, Routes } from '@angular/router';

//importamos los componentes
import { LoginComponent } from './components/login/login.component';
import { HomeComponent } from './components/home/home.component';
import { MedicosComponent } from './components/admin/medicos.component';
import { AdminPanelComponent } from './components/admin/admin-panel.component';
import { PasesComponent } from './components/pacientes/pases.component';

//importamos servicios
import { AuthService } from "./services/auth.service";

const APP_ROUTES: Routes = [
  { path: '',
    component: LoginComponent,
    data: { title: 'Login' }
  },
  {
    path: 'home',
    component: HomeComponent,
    data: { title: 'Home' },
    canActivate: [AuthService]
  },
  {
    path: 'medicos',
    component: MedicosComponent,
    data: { title: 'Médicos' },
    canActivate: [AuthService]
  },
  {
    path: 'administracion',
    component: AdminPanelComponent,
    data: { title: 'Administración' },
    canActivate: [AuthService]
  },
  {
    path: 'pasenuevo',
    component: PasesComponent,
    data: { title: 'Emisión de pases' },
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
