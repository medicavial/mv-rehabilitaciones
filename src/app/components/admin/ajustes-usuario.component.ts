import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from "../../services/auth.service";
import { BusquedasService } from "../../services/busquedas.service";
declare var M: any;

@Component({
  selector: 'app-ajustes-usuario',
  templateUrl: './ajustes-usuario.component.html'
})
export class AjustesUsuarioComponent implements OnInit {
  usuario:any = {};
  collapsible:any;

  constructor( public _authService:AuthService,
               private _busquedas:BusquedasService ) {
                 this.usuario = this._authService.datosUsuario();
               }

  ngOnInit() {
    this.preparaCollapsible();
  }

  preparaCollapsible(){
    console.log( 'collapsible' )
    // document.addEventListener('DOMContentLoaded', function() {
      this.collapsible = document.querySelectorAll('.collapsible');
      var instances = M.Collapsible.init(this.collapsible, {});
    // });
  }
}
