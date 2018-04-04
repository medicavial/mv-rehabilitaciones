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
               private _busquedas:BusquedasService ) { }

  ngOnInit() {
    // this._authService.auth();
    this.getlistadoPases();
    this.usuario = this._authService.datosUsuario();
  }

  getlistadoPases(){
    this.buscando = true;
    this._busquedas.listadoPases()
                   .subscribe( data =>{
                     this.listadoPases = data;
                     this.buscando = false;
                   })
  }



}
