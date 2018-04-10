import { Component, OnInit } from '@angular/core';
import { AuthService } from "../../services/auth.service";
import { BusquedasService } from "../../services/busquedas.service";


@Component({
  selector: 'app-home',
  templateUrl: './home.component.html'
})
export class HomeComponent implements OnInit {
  usuario:any = {};
  listadoPases:any = {};
  buscando:boolean = false;
  constructor( public _authService:AuthService,
               private _busquedas:BusquedasService ) {
                 this.usuario = this._authService.datosUsuario();
               }

  ngOnInit() {
    // this._authService.auth();
    this.getlistadoPases();
  }

  getlistadoPases(){
    console.log(this.usuario);
    this.buscando = true;
    this._busquedas.listadoPases( this.usuario )
                   .subscribe( data =>{
                     this.listadoPases = data;
                     this.buscando = false;
                   })
  }



}
