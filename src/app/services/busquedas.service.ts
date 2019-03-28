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
    let url = `${this.link.principal}/externos/login`;
    let headers = new Headers({
      'Content-Type':'aplication/json'
    });

    return this._http.post( url, datos, {headers} )
                     .map( res => {
                       return res.json();
                     });
  }

  listadoMedicos( idUsuario ){
    let url = `${this.link.principal}/externos/listadoMedicos/${idUsuario}`;

    return this._http.get( url )
                     .map( res => {
                       return res.json();
                     });
  }

  listadoPases( usuario ){
    // console.log(usuario)
    let url = `${ this.link.principal}/externos/listadopases-`+usuario.USU_id;

    return this._http.get( url )
                     .map( res => {
                       return res.json();
                     });
  }

  listaUnidades(){
    let url = `${ this.link.principal}/busquedas/listadoUnidades`;

    return this._http.get( url )
                     .map( res => {
                       return res.json();
                     });
  }

  verificaUsername( dato ){
    let url = `${ this.link.principal}/externos/verifica-`+dato;

    return this._http.get( url )
                     .map( res => {
                       return res.json();
                     });
  }

  getRehabilitaciones( folio ){
    // let url = `${this.link.propias}catalogos.php?funcion=getRehabilitaciones&fol=` + folio;
    let url = `${this.link.principal}/externos/infosesiones/${folio}`;

    return this._http.get( url )
                     .map( res => {
                       return res.json();
                     });
  }

  getInformeReh( folio ){
    let url = `${ this.link.propias}infRehabilitacion.php?funcion=getListaNotasRehab&fol=`+folio;

    return this._http.get( url )
                     .map( res => {
                       return res.json();
                     });
  }

}
