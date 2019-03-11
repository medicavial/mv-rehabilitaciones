import { Injectable } from '@angular/core';

@Injectable()
export class ApiService {

  // EN PRODUCCION
  conexiones = {
    principal:  'https://busqueda.medicavial.net/api',
    propias:    'https://medicavial.net/mvnuevo/api/',
    red:        'https://api.medicavial.net/api/',
    inventario: 'https://api.medicavial.mx/api/'
  }

  // EN LOCAL
  // conexiones = {
  //   principal:  'http://localhost:8000',
  //   propias:    'https://medicavial.net/mvnuevo/api/',
  //   red:        'http://api.medicavial.net/api/',
  //   inventario: 'http://localhost/inventario/server/public/'
  // }

  // apiKeys = {
  //   googleMaps: 'AIzaSyB9gOLIqI5WKpfBy-UEUkOHTRsouH3016A',
  // }

  constructor() { }

  conexion() {
    return this.conexiones;
  }
}
