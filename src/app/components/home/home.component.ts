import { Component, OnInit } from '@angular/core';
import { AuthService } from "../../services/auth.service";
import { BusquedasService } from "../../services/busquedas.service";
import { Router } from '@angular/router';
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
  selected = [];

  constructor( public _authService:AuthService,
               private _busquedas:BusquedasService,
               private _router:Router ) {
                 this.usuario = this._authService.datosUsuario();
               }

  ngOnInit() {
    // this._authService.auth();
    // this.getlistadoPases();
    this.recargaDatos();
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

  verMasDetalles(){
    this.ver = !this.ver;
  }

  seleccion({ selected }){
    // console.log('Select Event', selected, this.selected);
    console.log(selected[0].claveOrden);
    window.open('http://busqueda.medicavial.net/api/externos/verpdf-'+selected[0].claveOrden, '_blank ');
  }

  recargaDatos(){
    //solo recargamos cuando estemos en /inicio
    if ( this._router.url === '/inicio' ) {
        console.info('Reload');

        this.getlistadoPases();
        setTimeout(()=>{    //<<<---    using ()=> syntax
          this.recargaDatos();
        },180000); //recarga los datos al pasar 3 minutos
    }
  }

}
