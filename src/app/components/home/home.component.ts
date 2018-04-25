import { Component, OnInit } from '@angular/core';
import { AuthService } from "../../services/auth.service";
import { BusquedasService } from "../../services/busquedas.service";
declare var M: any;
declare var $: any;

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html'
})
export class HomeComponent implements OnInit {
  usuario:any = {};
  listadoPases:any = {};
  buscando:boolean = false;
  ver:boolean = false;
  editing = {};
  rows:any;
  temp = [];
  table = { offset:0 };
  floatAction:any;
  tooltip:any;
  opciones:boolean = false;

  constructor( public _authService:AuthService,
               private _busquedas:BusquedasService ) {
                 this.usuario = this._authService.datosUsuario();
               }

  ngOnInit() {
    // this._authService.auth();
    this.getlistadoPases();
    this.preparaBotones();
    this.preparaTooltip();
  }

  preparaBotones(){
    this.floatAction = document.querySelector('.fixed-action-btn');
    var instance = M.FloatingActionButton.init(this.floatAction, {
      direction: 'left'
    });
  }

  preparaTooltip(){
    this.tooltip = document.querySelector('.tooltipped');
    var instance = M.Tooltip.init(this.tooltip, {
      html: 'Búsqueda avanzada',
      position: 'left'
    });
  }

  btnControl( valor ){
    var instance = M.FloatingActionButton.getInstance(this.floatAction);
    if ( valor === true) {
        instance.open();
    } else{
      instance.close();
    }
  }

  updateFilter(event) {
    const val = event.target.value.toLowerCase();
    // Filtramos los datos
    const temp = this.temp.filter(function(d) {
      return d.nombreCompleto.toLowerCase().indexOf(val) !== -1 || !val;
    });

    // actualizamos el listado
    this.rows = temp;
    // siempre que cambia el filtro mandamos a la primer pagina
    this.table.offset = 0;
  }

  getlistadoPases(){
    // console.log(this.usuario);
    this.buscando = true;
    this._busquedas.listadoPases( this.usuario )
                   .subscribe( data =>{
                     this.listadoPases = data;
                     // console.log(this.listadoPases);
                     this.rows = data;
                     this.temp = data;
                     this.buscando = false;
                   })
  }

  verOpciones(){
    this.opciones = !this.opciones;
    var instance = M.Tooltip.getInstance(this.tooltip);
    instance.destroy();

    this.preparaTooltip();
  }



}
