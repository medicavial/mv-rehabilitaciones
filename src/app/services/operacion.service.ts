import { Injectable } from '@angular/core';
import { ApiService } from "./api.service";
import { Http, Headers } from '@angular/http';
import 'rxjs/Rx';


@Injectable()
export class OperacionService {

  constructor( private _api:ApiService,
               private _http:Http) {}

  link = this._api.conexion();

  generaPase( datos ){
   let url = `${ this.link.principal }/externos/generapase`;
   let headers = new Headers({
     'Content-Type':'aplication/json'
   });

   return this._http.post( url, datos, {headers} )
                    .map( res => {
                      return res.json();
                    });
  }

  guardaUsuario( datos ){
    let url = `${ this.link.principal }/externos/guarda-usuario`;
    let headers = new Headers({
      'Content-Type':'aplication/json'
    });

    return this._http.post( url, datos, {headers} )
                     .map( res => {
                       return res.json();
                     });
  }

}
