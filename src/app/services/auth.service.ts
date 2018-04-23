import { Injectable } from '@angular/core';
import { Router, ActivatedRouteSnapshot, RouterStateSnapshot, CanActivate, CanDeactivate } from "@angular/router";
import { Http, Headers } from '@angular/http';
import 'rxjs/Rx';

@Injectable()
export class AuthService implements CanActivate {

  constructor( private router:Router,
               private _http:Http) {}

  canActivate( next:ActivatedRouteSnapshot, state:RouterStateSnapshot ){
    if (sessionStorage.getItem('session')  || localStorage.getItem('session')) {
        if (localStorage.getItem('session')) {
            sessionStorage.setItem('session',JSON.stringify( JSON.parse(localStorage.getItem('session'))));
        }
        // console.log("Está autenticado");
        return true;
    } else {
      // console.log("no puede entrar");
      this.router.navigate(['']);
      return false;
    }
  }

  auth(){
    if (sessionStorage.getItem('session')  || localStorage.getItem('session')) {
        this.router.navigate(['inicio']);
        if (localStorage.getItem('session')) {
            sessionStorage.setItem('session',JSON.stringify( JSON.parse(localStorage.getItem('session'))));
        }
        // return JSON.parse(localStorage.getItem('userSession'))
        return true;
    } else{
      // console.log("no ha iniciado sesion");
      this.router.navigate(['']);
      return false;
    }
  }

  checkSession(){
    if (sessionStorage.getItem('session')  || localStorage.getItem('session')) {
        if (localStorage.getItem('session')) {
            sessionStorage.setItem('session',JSON.stringify( JSON.parse(localStorage.getItem('session'))));
        }
        return true;
    } else{
        return false;
    }
  }

  datosUsuario(){
    return JSON.parse( sessionStorage.getItem('session') );
  }

  login( datos, recordar ){
    if ( datos.length === 1 && datos[0].username != '' ) {
        sessionStorage.setItem( 'session', JSON.stringify( datos[0] ) );
        if ( recordar === true ) {
            localStorage.setItem( 'session', JSON.stringify( datos[0] ) );
        }
        return true;
    } else {
      return false;
    }
  }

  logout(){
    sessionStorage.removeItem('session');
    if ( localStorage.getItem('session') ) {
        localStorage.removeItem('session');
    }

    this.auth();

  }

}
