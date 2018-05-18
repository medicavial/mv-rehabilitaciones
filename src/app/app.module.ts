import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';
import { NgxDatatableModule } from '@swimlane/ngx-datatable';

//DATOS EN ESPAÑOL-MX
import { LOCALE_ID } from '@angular/core';
import { registerLocaleData } from '@angular/common';
import localeEsMX from '@angular/common/locales/es-MX';
registerLocaleData(localeEsMX);

//SERVICIOS
import { ApiService } from './services/api.service';
import { AuthService } from "./services/auth.service";
import { BusquedasService } from "./services/busquedas.service";
import { OperacionService } from "./services/operacion.service";
import { FechasService } from './services/fechas.service';

//RUTAS
import { APP_ROUTING } from './app.routes';

//COMPONENTES
import { AppComponent } from './app.component';
import { HomeComponent } from './components/home/home.component';
import { LoginComponent } from './components/login/login.component';
import { NavbarComponent } from './components/navbar/navbar.component';
import { MedicosComponent } from './components/admin/medicos.component';
import { AdminPanelComponent } from './components/admin/admin-panel.component';
import { PasesComponent } from './components/pacientes/pases.component';
import { DomseguroPipe } from './pipes/domseguro.pipe';
import { AyudaComponent } from './components/ayuda/ayuda.component';
import { UsuariosComponent } from './components/admin/usuarios.component';
import { AjustesUsuarioComponent } from './components/admin/ajustes-usuario.component';


@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    LoginComponent,
    NavbarComponent,
    MedicosComponent,
    AdminPanelComponent,
    PasesComponent,
    DomseguroPipe,
    AyudaComponent,
    UsuariosComponent,
    AjustesUsuarioComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    ReactiveFormsModule,
    HttpModule,
    APP_ROUTING,
    NgxDatatableModule
  ],
  providers: [
    { provide: LOCALE_ID, useValue: 'es-MX' },
    ApiService,
    AuthService,
    BusquedasService,
    OperacionService,
    FechasService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
