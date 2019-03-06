import { Component, OnInit } from '@angular/core';
import { AuthService } from "../../services/auth.service";
import { BusquedasService } from "../../services/busquedas.service";
import { OperacionService } from "../../services/operacion.service";
import { FechasService } from '../../services/fechas.service';
import { FormGroup, FormControl, Validators, FormArray } from '@angular/forms';
declare var M: any;
declare var $: any;

@Component({
  selector: 'app-pases',
  templateUrl: './pases.component.html'
})
export class PasesComponent implements OnInit {
  usuario:any = {};
  unidades:any = {};
  datosUni:any = {};
  cambiosEmail:string = '';
  elem:any;
  modal:any;
  mdlUni:any;
  box:any;
  buscando:boolean = false;
  trabajando:boolean = false;
  fechaNacimiento= null;
  paseForm:FormGroup;
  locales:boolean = undefined; //undefined
  respuestaOrden:any = {};
  pantalla = screen.width;

  constructor( public _authService:AuthService,
               private _busquedas:BusquedasService,
               private _operacion:OperacionService,
               private _fechas:FechasService) {
                 this.usuario = this._authService.datosUsuario();

                 this.paseForm = new FormGroup({
                   'nombre'         : new FormControl( '', [ Validators.minLength(1), Validators.required ] ), // Validators.pattern("^[a-zñáéíóúA-ZÑÁÉÍÓÚ ]*$")
                   'aPaterno'       : new FormControl( '', [ Validators.minLength(1), Validators.required ] ), // Validators.pattern("^[a-zñáéíóúA-ZÑÁÉÍÓÚ ]*$")
                   'aMaterno'       : new FormControl( '', [] ), // Validators.pattern("^[a-zñáéíóúA-ZÑÁÉÍÓÚ ]*$")
                   'fechaNacimiento': new FormControl( null, [ Validators.required ] ),
                   'sexo'           : new FormControl( '', [] ),
                   'telefono'       : new FormControl( '', [ Validators.minLength(10), Validators.maxLength(10) ] ),
                   'email'          : new FormControl( '', [] ),
                   'servicio'       : new FormControl( '', [] ),
                   'diagnostico'    : new FormControl( '', [ Validators.required, Validators.minLength(3) ] ),
                   'objetivo'       : new FormControl( '', [ Validators.required, Validators.minLength(3) ] ),
                   'sesiones'       : new FormControl( 10, [ Validators.required, Validators.min(1), Validators.max(99) ] ),
                   'tipoTerapia'    : new FormControl( '', [ Validators.required ] ), //tipoTerapia = observaciones
                   'unidad'         : new FormControl( null, [ Validators.required ] ),
                   'imprimeOrden'   : new FormControl( false, [] ),
                   'mailPaciente'   : new FormControl( false, [] ),
                   'copiaOrden'     : new FormControl( false, [] ),
                   'mailUsuario'    : new FormControl( { value: this.usuario.USU_email, disabled: true}, [ Validators.required ] ),
                 });

                 if (this.usuario.TIU_id != 1 && this.usuario.TIU_id != 3 ) {
                   this.paseForm.controls['servicio'].setValue('SR');
                 }

               }

  ngOnInit() {
    this.preparaTooltip();
    this.preparaTextField();
    this.preparaBox();
    this.preparaModal();
    this.preparaModalUni();
    this.preparaTimepicker();
    this.getListaUnidades();
    // this.uniLocal( true );
    this.selectUnidad(0 ,false);
  }

  preparaTimepicker(){
    let fechas = this._fechas.fechaActual();

    this.elem = document.querySelector('.datepicker');
    var instance = M.Datepicker.init(this.elem, {
      format: 'yyyy-mm-dd',
      showMonthAfterYear: true,
      // showClearBtn: true,
      yearRange: [
        fechas.anio-100,
        fechas.anio
      ],
      maxDate: new Date(fechas.anio, fechas.mes, fechas.dia),
      minDate: new Date(fechas.anio-100, fechas.mes, fechas.dia),
      defaultDate: new Date(fechas.anio-20, 5, 1),
      setDefaultDate: true,
      i18n: this._fechas.formatoIdioma()
    });
  }

  abrePicker(){
    var instance = M.Datepicker.getInstance(this.elem);
    instance.open();
  }

  preparaModal(){
    this.modal = document.querySelector('.modal');
    var modal = M.Modal.init(this.modal, { dismissible:false });
  }

  preparaModalUni(){
    this.mdlUni = document.querySelector('#mdlUnidad');
    var modal = M.Modal.init(this.mdlUni, { dismissible:false });
  }

  preparaTextField(){
    $(document).ready(function() {
      M.updateTextFields();
    });
  }

  preparaTooltip(){
    var elem = document.querySelector('.tooltipped');
    var instance = M.Tooltip.init(elem, {
      inDuration: 200,
      outDuration: 200,
      position: 'top',
      html: 'Click para abrir en Google Maps <i class="mdi mdi-open-in-new"></i>',
    });
  }

  preparaBox(){
    this.box = document.querySelector('.materialboxed');
    var box = M.Materialbox.init(this.box, {});
  }

  abreBox(){
    var box = M.Materialbox.getInstance(this.box);
    box.open();
  }

  fechaNac($e){
    let instance = M.Datepicker.getInstance(this.elem);
    if ( instance.date != null ) {
      this.paseForm.controls.fechaNacimiento.setValue(this._fechas.transformaFecha( instance.date ));
    }
  }

  limpiarCampos(){
    let instance = M.Datepicker.getInstance(this.elem); //limpiar campo
    instance.$el[0].value = null;
    this.uniLocal( true );
    this.paseForm.reset();
    this.cambiosEmail = '';
    this.datosUni = {};
  }

  generarPase(){
    if (this.paseForm.valid) {
      this.trabajando = true;

      let datos = {
          nombre: this.mayusculas( this.paseForm.controls['nombre'].value ),
          aPaterno: this.mayusculas( this.paseForm.controls['aPaterno'].value ),
          aMaterno: this.mayusculas( this.paseForm.controls['aMaterno'].value ),
          fechaNacimiento: this.paseForm.controls['fechaNacimiento'].value,
          sexo: this.mayusculas( this.paseForm.controls['sexo'].value ),
          telefono: this.paseForm.controls['telefono'].value,
          email: this.paseForm.controls['email'].value,
          usuario: this.usuario.username,
          servicio: this.paseForm.controls['servicio'].value,
          diagnostico: this.mayusculas( this.paseForm.controls['diagnostico'].value ),
          objetivo: this.mayusculas( this.paseForm.controls['objetivo'].value ),
          sesiones: this.paseForm.controls['sesiones'].value,
          tipoTerapia: this.mayusculas( this.paseForm.controls['tipoTerapia'].value ),
          unidad: this.paseForm.controls['unidad'].value,
          imprimeOrden: this.paseForm.controls['imprimeOrden'].value,
          mailPaciente: this.paseForm.controls['mailPaciente'].value,
          copiaOrden: this.paseForm.controls['copiaOrden'].value,
          mailUsuario: this.paseForm.controls['mailUsuario'].value,
      }
      console.log( datos );

      this._operacion.generaPase( datos )
                     .subscribe( data =>{
                       console.log(data);
                       if ( data.id > 0 ) {
                         this.respuestaOrden = data;
                         this.limpiarCampos();
                         this.abreModal();
                         this.trabajando = false;
                       }else{
                         this.trabajando = false;
                         alert(data.mensaje+'. Contacte a soporte si sigue ocurriendo.');
                       }
                     })
    }
  }

  mayusculas( dato ){
    return dato.toUpperCase();
  }

  abreModal(){
    var modal = M.Modal.getInstance(this.modal);
    modal.open();
  }

  cierraModal(){
    var modal = M.Modal.getInstance(this.modal);
    modal.close();
  }

  getListaUnidades(){
    this.buscando = true;
    this._busquedas.listaUnidades()
                   .subscribe( data =>{
                      // this.unidades = data;
                      this.unidades = this.ordenaUnidades( data );
                      // console.log( this.unidades );
                      this.buscando = false;
                   })
  }

  ordenaUnidades( datos ){
    for (let i = 0; i < datos.length; i++) {
      // filtramos las unidades por local o foranea
      if ( datos[i].Uni_clave < 999 ) {
        if ( datos[i].Uni_clave < 4 || datos[i].Uni_clave === 184 ) {
            datos[i].local = true;
            datos[i].img = new Image();
            datos[i].img.src = '../../assets/img/clinicas/' + datos[i].Uni_clave+'.jpg';
            datos[i].map = datos[i].Uni_latitud+','+datos[i].Uni_longitud;
            // datos[i].map = datos[i].Uni_nombre+', '+datos[i].Uni_calleNum+', '+datos[i].Uni_colMun;
            datos[i].imgMap = new Image();
            datos[i].imgMap.src = 'http://busqueda.medicavial.net/api/img/maps/'+datos[i].Uni_clave+'.png';
            // datos[i].imgMap.src = 'https://maps.googleapis.com/maps/api/staticmap?center='+datos[i].Uni_latitud+','+datos[i].Uni_longitud+'&zoom=16&size=600x300&markers=color:red|label:M|'+datos[i].Uni_latitud+','+datos[i].Uni_longitud+'&key=AIzaSyB9gOLIqI5WKpfBy-UEUkOHTRsouH3016A';
        } else {
          datos[i].local = false;
          datos[i].img = new Image();
          datos[i].img.src = '../../assets/img/clinicas/'+datos[i].Uni_clave+'.jpg';
          datos[i].map = datos[i].Uni_latitud+','+datos[i].Uni_longitud;
          // datos[i].map = datos[i].Uni_nombre+' + '+datos[i].Uni_calleNum+', '+datos[i].Uni_colMun;
          datos[i].imgMap = new Image();
          datos[i].imgMap.src = 'http://busqueda.medicavial.net/api/img/maps/'+datos[i].Uni_clave+'.png';
          // datos[i].imgMap.src = 'https://maps.googleapis.com/maps/api/staticmap?center='+datos[i].Uni_latitud+','+datos[i].Uni_longitud+'&zoom=16&size=600x300&markers=color:red|label:M|'+datos[i].Uni_latitud+','+datos[i].Uni_longitud+'&key=AIzaSyB9gOLIqI5WKpfBy-UEUkOHTRsouH3016A';
        }
      } else{
        //quitamos las unidades que no son mv
        datos.splice(i, 2); //esto no debería de quedar así
      }
    }
    // console.log(datos)
    return datos;
  }

  uniLocal( valor ){
    this.locales = valor;
    this.paseForm.controls['unidad'].setValue( null );
  }

  selectUnidad( unidad, modal ){
    this.paseForm.controls['unidad'].setValue( unidad );
    // console.log(this.unidades)

    if ( unidad === 0 ) {
        // this.cancelaUnidad();
        this.datosUni = {};
        this.paseForm.controls['unidad'].setValue(0);
        // this.datosUni.Uni_clave = 0;
        // this.datosUni.Uni_nombre = 'Cualquier Unidad';
    }

    if ( unidad > 0 && modal === true ) {
        this.modalUni( unidad );
    }
    if ( unidad > 0 && modal === false ) {
        this.unidadDatos( unidad );
    }
  }

  modalUni( unidad ){
    this.preparaTooltip();
    this.unidadDatos( unidad );
    var modal = M.Modal.getInstance(this.mdlUni);
    modal.open();
  }

  unidadDatos( unidad ){
    // console.log(unidad);
    for ( let i = 0; i < this.unidades.length; i++ ) {
        if ( this.unidades[i].Uni_clave === unidad ) {
            this.datosUni = this.unidades[i];
        }
    }
  }

  cambioMail( $e ){
    $(document).ready(function() {
      M.updateTextFields();
    });
    this.cambiosEmail = this.paseForm.controls['email'].value;
  }

  cambioMail2( $e ){
    $(document).ready(function() {
      M.updateTextFields();
    });
    this.paseForm.controls['email'].setValue( this.cambiosEmail );
  }

  activaMailUsr( $e ){
    $(document).ready(function() {
      M.updateTextFields();
    });
    if ( this.paseForm.controls['copiaOrden'].value === true ) {
      this.paseForm.controls['mailUsuario'].reset({ value: this.usuario.USU_email, disabled: false }, [Validators.required]);
    } else{
      this.paseForm.controls['mailUsuario'].reset({ value: this.usuario.USU_email, disabled: true }, []);
    }
  }

  cancelaUnidad(){
    this.datosUni = {};
    this.paseForm.controls['unidad'].setValue(null);
    this.cierrtaTooltip();
  }

  cierrtaTooltip(){
    var elem = document.querySelector('.tooltipped');
    var instance = M.Tooltip.getInstance(elem);
    instance.destroy();
    // this.preparaTooltip();
  }
}
