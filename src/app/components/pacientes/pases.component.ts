import { Component, OnInit } from '@angular/core';
import { AuthService } from "../../services/auth.service";
import { BusquedasService } from "../../services/busquedas.service";
import { OperacionService } from "../../services/operacion.service";
import { FechasService } from '../../services/fechas.service';
import { FormGroup, FormControl, Validators, FormArray } from '@angular/forms';
declare var M: any;

@Component({
  selector: 'app-pases',
  templateUrl: './pases.component.html'
})
export class PasesComponent implements OnInit {
  usuario:any = {};
  elem:any;
  modal:any;
  box:any;
  buscando:boolean = false;
  trabajando:boolean = false;
  fechaNacimiento= null;
  paseForm:FormGroup;

  constructor( public _authService:AuthService,
               private _busquedas:BusquedasService,
               private _operacion:OperacionService,
               private _fechas:FechasService) {
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
                 });

                 this.usuario = this._authService.datosUsuario();
               }

  ngOnInit() {
    this.preparaBox();
    this.preparaModal();
    this.preparaTimepicker();
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
    this.paseForm.reset();
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
    }
    console.log( datos );

    this._operacion.generaPase( datos )
                   .subscribe( data =>{
                     console.log(data);
                     if ( data.id > 0 ) {
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
}
