import { Injectable } from '@angular/core';

@Injectable()
export class FechasService {

  constructor() { }

  fechaActual(){
    let completa = new Date();

    let fechas = {
      completa: completa,
      dia: completa.getDate(),
      mes: completa.getMonth(),
      anio: completa.getFullYear()
    }

    return fechas;
  }

  pickerNacimiento(){

  }

  transformaFecha(fecha){
    let dia= fecha.getDate();
    let mes= fecha.getMonth()+1;
    let anio= fecha.getFullYear();

    if (dia<10) { dia = '0'+dia }
    if (mes<10) { mes = '0'+mes }

    let fechaNueva = anio+'-'+mes+'-'+dia;
    return fechaNueva;
  }

  formatoIdioma(){
    let formato = {
            cancel: 'Cancelar',
            clear:  'Limpiar',
            done:   'Ok',
            months: [ 'Enero','Febrero','Marzo','Abril','Mayo','Junio','Julio','Agosto','Septiembre','Octubre','Noviembre','Diciembre' ],
            monthsShort: [ 'Ene','Feb','Mar','Abr','May','Jun','Jul','Ago','Sep','Oct','Nov','Dic' ],
            weekdays: [ 'Domingo','Lunes','Martes','Miércoles','Jueves','Viernes','Sábado' ],
            weekdaysShort: [ 'Dom','Lun','Mar','Mie','Jue','Vie','Sab' ],
            weekdaysAbbrev: [ 'D','L','M','M','J','V','S' ],
          }
    return formato;
  }

}
