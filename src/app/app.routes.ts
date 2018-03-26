//importamos RouterModule
import { RouterModule, Routes } from '@angular/router';

//importamos los componentes
import { LoginComponent } from './components/login/login.component';
import { HomeComponent } from './components/home/home.component';

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
    data: { title: 'Home' }
    // canActivate: [AuthService]
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
