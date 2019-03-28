import { Component, OnInit } from '@angular/core';
import { AuthService } from "../../services/auth.service";
import { BusquedasService } from "../../services/busquedas.service";
declare var M: any;

@Component({
  selector: 'app-medicos',
  templateUrl: './medicos.component.html'
})
export class MedicosComponent implements OnInit {
  usuario:any = {};
  medicos:any = {};
  buscando: boolean = false;

  elem:any;

  constructor( public _authService:AuthService,
               private _busquedas:BusquedasService ) {
                 this.usuario = this._authService.datosUsuario();
               }

  ngOnInit() {
    // this._authService.auth();
    this.medicos = this.listadoMedicos();

    this.elem = document.querySelector('.modal');
    var instance = M.Modal.init(this.elem, {
                                              dismissible: false,
                                            });
  }

  listadoMedicos(){
    this.buscando = true;
    this._busquedas.listadoMedicos( this.usuario.USU_id )
                   .subscribe( data =>{
                     console.log(data);
                     if ( data.length > 0 ) {
                       this.medicos = data;
                     }
                     this.buscando = false;
                   })
  }

  modalAlta(){
    var instance = M.Modal.getInstance(this.elem);
    instance.open();
  }

  cancelaAlta(){
    var instance = M.Modal.getInstance(this.elem);
    instance.close();
  };

}
