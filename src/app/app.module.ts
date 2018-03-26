import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';
import { LOCALE_ID } from '@angular/core';

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


@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    LoginComponent,
    NavbarComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    ReactiveFormsModule,
    HttpModule,
    APP_ROUTING
  ],
  providers: [
    { provide: LOCALE_ID, useValue: "esMX" },
    ApiService,
    AuthService,
    BusquedasService,
    OperacionService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
