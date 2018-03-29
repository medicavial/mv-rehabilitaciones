import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';

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

//RUTAS
import { APP_ROUTING } from './app.routes';

//COMPONENTES
import { AppComponent } from './app.component';
import { HomeComponent } from './components/home/home.component';
import { LoginComponent } from './components/login/login.component';
import { NavbarComponent } from './components/navbar/navbar.component';
import { MedicosComponent } from './components/admin/medicos.component';
import { AdminPanelComponent } from './components/admin/admin-panel.component';


@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    LoginComponent,
    NavbarComponent,
    MedicosComponent,
    AdminPanelComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    ReactiveFormsModule,
    HttpModule,
    APP_ROUTING
  ],
  providers: [
    { provide: LOCALE_ID, useValue: 'es-MX' },
    ApiService,
    AuthService,
    BusquedasService,
    OperacionService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
