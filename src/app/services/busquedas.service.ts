import { Injectable } from '@angular/core';
import { ApiService } from "./api.service";
import { Http, Headers } from '@angular/http';
import 'rxjs/Rx';

@Injectable()
export class BusquedasService {

  constructor( private _api:ApiService,
               private _http:Http) {}

  link = this._api.conexion();

  logueo( datos ){
    let url = `${ this.link.principal}/externos/login`;
    let headers = new Headers({
      'Content-Type':'aplication/json'
    });

    return this._http.post( url, datos, {headers} )
                     .map( res => {
                       return res.json();
                     });
  }
}
