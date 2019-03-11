import { Component, OnInit } from '@angular/core';
import { Title, Meta } from "@angular/platform-browser";
import { Router, NavigationStart, NavigationEnd, ActivatedRoute } from "@angular/router";
import { AuthService } from "../../services/auth.service";
import { Observable } from 'rxjs/Rx';
declare var $: any;
declare var M: any;

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html'
})
export class NavbarComponent implements OnInit {
usuario = {};
elem: any;
instance:any;
pantalla = window.innerWidth;
tituloSeccion:any;

  constructor( public _authService: AuthService,
               private titleService: Title,
               private metaService: Meta,
               private router:Router,
               private _activatedRoute: ActivatedRoute) {
     //Cada que cambie de ruta verificamos los datos de sesion
     this.router.events.subscribe( event => {
       if (event instanceof NavigationEnd) {
         this.tituloSeccion = this.datosSeccion(router.url);
          if ( sessionStorage.getItem('session') ) {
              this.usuario = _authService.datosUsuario();
              //se carga el menu lateral
              $(document).ready(() => {
                this.elem = document.querySelector('.sidenav');
                this.instance = M.Sidenav.init(this.elem, {
                  draggable: true
                });
              });
          }
       }
     });

     // Detectamos el cambio de temaño de pantalla
     Observable.fromEvent(window, 'resize')
               .subscribe((event) => {
                 // console.log(event);
                 this.pantalla = window.innerWidth;
                 console.log(this.pantalla);
               });

    this.usuario = this._authService.datosUsuario();
    $(document).ready(function(){
      $('.sidenav').sidenav();
    });
  }

  ngOnInit() {
    // console.log(this.usuario);
  }

  private datosSeccion(url){
    // console.log(url)
    // console.log( this.router.config )
    for (let i = 0; i < this.router.config.length; i++) {
        if (this.router.config[i].path === url.substr(1) ) {
            return this.router.config[i].data.title;
        }
    }
  }

  logout(){
    this._authService.logout();
    this.cerrarSideNav();
  }

  cerrarSideNav(){
    var sidenav = M.Sidenav.getInstance(this.elem);
    // this.pantalla = screen.width;
    if ( this.pantalla < 993 ) {
      sidenav.close();
    }
  }

  prueba(){
    // console.log('realiza algo y cierra el menu si la pantalla es pequeña');
    this.cerrarSideNav();
  }

}
