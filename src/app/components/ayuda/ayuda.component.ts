import { Component, OnInit } from '@angular/core';
import { AuthService } from "../../services/auth.service";
import { BusquedasService } from "../../services/busquedas.service";

@Component({
  selector: 'app-ayuda',
  templateUrl: './ayuda.component.html'
})
export class AyudaComponent implements OnInit {
  buscando:boolean = false;
  verContacto:boolean = false;
  verGuias:boolean = false;

  clinicas:any = {};

  constructor( public _authService:AuthService,
               private _busquedas: BusquedasService ) {}

  ngOnInit() {
    // this.getListaUnidades();
  }

  getListaUnidades(){
    this.buscando = true;
    this._busquedas.listaUnidades()
                   .subscribe( data =>{
                     // console.log(data)
                      this.buscando = false;
                      this.clinicas=data;
                   })
  }

  switchContacto(){
    this.verContacto = !this.verContacto;
  }

  switchGuias(){
    this.verGuias = !this.verGuias;
  }
}
