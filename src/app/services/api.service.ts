import { Injectable } from '@angular/core';

@Injectable()
export class ApiService {

  conexiones = {
    principal:  'http://busqueda.medicavial.net/api/',
    propias:    'http://medicavial.net/mvnuevo/api/',
    red:        'http://api.medicavial.net/api/',
    inventario: 'http://api.medicavial.mx/api/'
  }

  // EN LOCAL
  // conexiones = {
  //   principal:  'http://localhost/SBU/server/public/',
  //   propias:    'http://localhost/mvnuevo/api/',
  //   red:        'http://api.medicavial.net/api/',
  //   inventario: 'http://localhost/inventario/server/public/'
  // }

  constructor() { }

  conexion(){
    return this.conexiones;
  }
}
