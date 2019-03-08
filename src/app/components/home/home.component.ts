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
  usuario: any = {};
  listadoPases: any = {};
  buscando:boolean = false;
  ver:boolean = false;
  editing = {};
  rows: any;
  temp = [];
  table = { offset:0 };
  floatAction: any;
  tooltip: any;
  tooltipMas: any;
  tooltipMenos: any;
  opciones:boolean = false;
  selected = [];
  helpers: any;
  modal: any;
  collapsible: any;
  datosPase: any = {};
  buscandoRh: boolean = false;
  buscandoInf: boolean = false;

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
    this.preparaAyudas();
    this.preparaModal();
    this.preparaCollapsible();
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
    this.tooltipMas = document.querySelector('.verMas');
    var instance = M.Tooltip.init(this.tooltipMas, {
      html: 'Ver más',
      position: 'right'
    });

    this.tooltipMenos = document.querySelector('.verMenos');
    var instance = M.Tooltip.init(this.tooltipMenos, {
      html: 'Vista sencilla',
      position: 'bottom'
    });
  }

  preparaAyudas(){
    // preparamos el tooltip
    this.helpers = document.querySelector('.ayudas');
    var instance = M.Tooltip.init(this.helpers, {});
  }

  preparaModal(){
    // preparamos el modal
    this.modal = document.querySelector('.modal');
    var instance = M.Modal.init(this.modal, {
      dismissible: false
    });
  }

  preparaCollapsible(){
    this.collapsible = document.querySelectorAll('.collapsible');
    var instance = M.Collapsible.init(this.collapsible, {});
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
    // console.log( document.getElementsByClassName('ayudas') );
    this.buscando = true;
    this._busquedas.listadoPases( this.usuario )
                   .subscribe( data =>{
                     this.listadoPases = data;
                     // console.log(this.listadoPases);
                     this.rows = data;
                     this.temp = data;
                     this.buscando = false;
                     this.preparaAyudas();
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
    let datoActivo = document.getElementsByClassName('active');
    // console.log('Select Event', selected, this.selected);
    this.datosPase = selected[0];
    this.abreModal();
    if ( this.datosPase.Exp_folio != null ) {
        this.getRehabilitaciones( this.datosPase.Exp_folio );
        this.getInfReh( this.datosPase.Exp_folio );
    }
    // window.open('http://busqueda.medicavial.net/api/externos/verpdf-'+selected[0].claveOrden, '_blank ');
  }

  abreModal(){
    var instance = M.Modal.getInstance(this.modal);
    instance.open();
  }

  cerrarModal(){
    this.datosPase = {};
    var instance = M.Modal.getInstance(this.modal);
    instance.close();
  }

  getRehabilitaciones( folioMV ){
    this.buscandoRh = true;
    this._busquedas.getRehabilitaciones( folioMV )
                   .subscribe( data =>{
                     this.datosPase.listadoRehabilitaciones = data;
                     this.buscandoRh = false;
                   })
  }

  getInfReh( folioMV ){
    this.buscandoInf = true;
    this._busquedas.getInformeReh( folioMV )
                   .subscribe( data =>{
                     this.datosPase.informeReh = data;
                     console.log(this.datosPase)
                     this.buscandoInf = false;
                   })
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
