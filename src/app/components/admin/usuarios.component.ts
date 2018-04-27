import { Component, OnInit } from '@angular/core';
import { AuthService } from "../../services/auth.service";
import { BusquedasService } from "../../services/busquedas.service";
declare var M: any;

@Component({
  selector: 'app-usuarios',
  templateUrl: './usuarios.component.html'
})
export class UsuariosComponent implements OnInit {
  usuario:any = {};
  buscando:boolean = false;
  listadoUsuarios: any = {};
  registro: boolean = false;
  tipoReg: string = '';

  constructor( public _authService:AuthService,
               private _busquedas:BusquedasService ) {
                 this.usuario = this._authService.datosUsuario();
               }

  ngOnInit() {
    this.listadoMedicos();
  }

  listadoMedicos(){
    this.buscando = true;
    this._busquedas.listadoMedicos()
                   .subscribe( data =>{
                     console.log(data);
                     if ( data.length > 0 ) {
                       this.listadoUsuarios = data;
                     }
                     this.buscando = false;
                   })
  }

  activareg(tipo){
    this.tipoReg = tipo;
    this.registro = !this.registro;
    if ( this.registro === false ) {
        this.tipoReg = '';
    }
  }

}
