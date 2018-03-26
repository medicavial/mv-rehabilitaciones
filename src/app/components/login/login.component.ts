import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators, FormArray } from '@angular/forms';
// import { ApiService } from "../../services/api.service";
import { AuthService } from "../../services/auth.service";
import { BusquedasService } from "../../services/busquedas.service";
import { Router } from "@angular/router";

declare var $:any;
declare var M:any;

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html'
})

export class LoginComponent implements OnInit {
  auth:boolean;
  credenciales:FormGroup;
  trabajando: boolean = false;

  constructor( private busquedasService:BusquedasService,
               private _authService:AuthService ) {
    this.auth = this._authService.auth();

    this.credenciales = new FormGroup({
      'username': new FormControl( '', [
                                         Validators.minLength(3),
                                         Validators.required
                                        ]),
      'password': new FormControl( '', [
                                         Validators.minLength(3),
                                         Validators.required
                                        ]),
      'remember': new FormControl(false),
    });
  }

  ngOnInit() {
    var elem = document.querySelector('.modal');
    var instance = M.Modal.init(elem);

    // var instance = new M.Collapsible(elem, {
    //   // inDuration: 1000,
    //   // outDuration: 1000
    // });
    // console.log(this.api.conexion());
    this._authService.auth();
  }

  enviaCredenciales(){
    this.trabajando = true;
    let credenciales = {
      username: this.credenciales.controls['username'].value,
      password: this.credenciales.controls['password'].value,
      remember: this.credenciales.controls['remember'].value,
    }

    this.busquedasService.logueo( credenciales )
                          .subscribe( data =>{
                            if ( data.length > 0 ) {
                              let verifica = this._authService.login( data, credenciales.remember );
                              if ( verifica === true ) {
                                this._authService.auth();
                                this.trabajando = false;
                              } else{
                                alert('Error al iniciar sesión');
                                this.trabajando = false;
                              }
                            } else {
                              alert('Datos incorrectos');
                              this.trabajando = false;
                            }
                          })
  }

}
