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
  locales:boolean = undefined;
  respuestaOrden:string = '';

  constructor( public _authService:AuthService,
               private _busquedas:BusquedasService,
               private _operacion:OperacionService,
               private _fechas:FechasService) {
                 this.usuario = this._authService.datosUsuario();

                 this.paseForm = new FormGroup({
                   'nombre'         : new FormControl( '', [ Validators.minLength(3), Validators.required ] ),
                   'aPaterno'       : new FormControl( '', [ Validators.minLength(3), Validators.required ] ),
                   'aMaterno'       : new FormControl( '', [ Validators.required ] ),
                   'fechaNacimiento': new FormControl( null, [ Validators.required ] ),
                   'sexo'           : new FormControl( '', [] ),
                   'telefono'       : new FormControl( '', [] ),
                   'email'          : new FormControl( '', [] ),
                   'diagnostico'    : new FormControl( '', [ Validators.required, Validators.minLength(5) ] ),
                   'objetivo'       : new FormControl( '', [ Validators.required, Validators.minLength(5) ] ),
                   'sesiones'       : new FormControl( null, [ Validators.required, Validators.min(1) ] ),
                   'tipoTerapia'    : new FormControl( '', [ Validators.required, Validators.minLength(5) ] ), //tipoTerapia = observaciones
                   'unidad'         : new FormControl( null, [ Validators.required ] ),
                   'imprimeOrden'   : new FormControl( false, [] ),
                   'mailPaciente'   : new FormControl( false, [] ),
                   'copiaOrden'     : new FormControl( false, [] ),
                   'mailUsuario'    : new FormControl( { value: this.usuario.USU_email, disabled: true}, [ Validators.required ] ),
                 });
               }

  ngOnInit() {
    this.preparaTextField();
    this.preparaBox();
    this.preparaModal();
    this.preparaModalUni();
    this.preparaTimepicker();
    this.getListaUnidades();
  }

  preparaTimepicker(){
    let fechas = this._fechas.fechaActual();

    this.elem = document.querySelector('.datepicker');
    var instance = M.Datepicker.init(this.elem, {
      format: 'yyyy-mm-dd',
      showMonthAfterYear: true,
      showClearBtn: true,
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

  preparaModal(){
    this.modal = document.querySelector('.modal');
    var modal = M.Modal.init(this.modal, { dismissible:false });
  }

  preparaModalUni(){
    this.mdlUni = document.querySelector('#mdlUnidad');
    var modal = M.Modal.init(this.mdlUni, {});
  }

  preparaTextField(){
    $(document).ready(function() {
      M.updateTextFields();
    });
  }

  preparaBox(){
    this.box = document.querySelector('.materialboxed');
    var box = M.Materialbox.init(this.box, {  });
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
    this.locales = undefined;
    this.paseForm.reset();
    this.cambiosEmail = '';
  }

  generarPase(){
    this.trabajando = true;

    let datos = {
        nombre: this.paseForm.controls['nombre'].value,
        aPaterno: this.paseForm.controls['aPaterno'].value,
        aMaterno: this.paseForm.controls['aMaterno'].value,
        fechaNacimiento: this.paseForm.controls['fechaNacimiento'].value,
        sexo: this.paseForm.controls['sexo'].value,
        telefono: this.paseForm.controls['telefono'].value,
        email: this.paseForm.controls['email'].value,
        usuario: this.usuario.username,
        diagnostico: this.paseForm.controls['diagnostico'].value,
        objetivo: this.paseForm.controls['objetivo'].value,
        sesiones: this.paseForm.controls['sesiones'].value,
        tipoTerapia: this.paseForm.controls['tipoTerapia'].value,
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
                       this.respuestaOrden = data.mensaje;
                       this.limpiarCampos();
                       this.abreModal();
                       this.trabajando = false;
                     }else{
                       this.trabajando = false;
                       alert(data.mensaje+'. Contacte a soporte si sigue ocurriendo.');
                     }
                   })
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
            datos[i].img.src = '../../assets/img/clinicas/'+datos[i].Uni_clave+'.jpg';
            datos[i].map = datos[i].Uni_nombre+', '+datos[i].Uni_calleNum+', '+datos[i].Uni_colMun;
        } else {
          datos[i].local = false;
          datos[i].img = new Image();
          datos[i].img.src = '../../assets/img/clinicas/'+datos[i].Uni_clave+'.jpg';
          datos[i].map = datos[i].Uni_nombre+' + '+datos[i].Uni_calleNum+', '+datos[i].Uni_colMun;
        }
      } else{
        //quitamos las unidades que no son mv
        datos.splice(i, 2); //esto no debería de quedar así
      }
    }
    return datos;
  }

  uniLocal( valor ){
    this.locales = valor;
  }

  selectUnidad( Uni_clave ){
    this.paseForm.controls.unidad.setValue( Uni_clave );
    this.modalUni( Uni_clave )
  }

  modalUni( unidad ){
    var modal = M.Modal.getInstance(this.mdlUni);
    modal.open();

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
}
