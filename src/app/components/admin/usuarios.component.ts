import { Component, OnInit } from '@angular/core';
import { AuthService } from "../../services/auth.service";
import { BusquedasService } from "../../services/busquedas.service";
import { OperacionService } from "../../services/operacion.service";
import { FormGroup, FormControl, Validators, FormArray } from '@angular/forms';
declare var M: any;
declare var $: any;

@Component({
  selector: 'app-usuarios',
  templateUrl: './usuarios.component.html'
})
export class UsuariosComponent implements OnInit {
  formReg:FormGroup;
  usuario:any = {};
  buscando:boolean = false;
  trabajando:boolean = false;
  listadoUsuarios: any = {};
  registro: boolean = false;
  tipoReg: string = '';
  username: boolean = false;
  buscaUsuario: boolean = false;
  primerBusqueda:boolean = false;
  cuentas = [];
  nuevaCuenta: boolean = false;

  constructor( public _authService:AuthService,
               private _busquedas:BusquedasService,
               private _operacion:OperacionService ) {
                 this.usuario = this._authService.datosUsuario();

                 this.formReg = new FormGroup({
                   'username'   : new FormControl( '', [ Validators.required, Validators.pattern("[a-zñA-ZÑ0-9]{4,20}") ] ), // Validators.pattern("^[a-zñáéíóúA-ZÑÁÉÍÓÚ ]*$")
                   'password'   : new FormControl( '', [ Validators.minLength(6), Validators.required ] ), // Validators.pattern("^[a-zñáéíóúA-ZÑÁÉÍÓÚ ]*$")
                   'nombre'     : new FormControl( '', [ Validators.minLength(1), Validators.required ] ), // Validators.pattern("^[a-zñáéíóúA-ZÑÁÉÍÓÚ ]*$")
                   'paterno'    : new FormControl( '', [ Validators.minLength(1), Validators.required ] ), // Validators.pattern("^[a-zñáéíóúA-ZÑÁÉÍÓÚ ]*$")
                   'materno'    : new FormControl( '', [] ), // Validators.pattern("^[a-zñáéíóúA-ZÑÁÉÍÓÚ ]*$")
                   'telFijo'    : new FormControl( '', [ Validators.minLength(10), Validators.maxLength(10), Validators.required ] ),
                   'telMovil'   : new FormControl( '', [ Validators.minLength(10), Validators.maxLength(10), Validators.required ] ),
                   'email'      : new FormControl( '', [ Validators.required, Validators.pattern("[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[A-Za-z]{2,3}$") ] ),
                   'rfc'        : new FormControl( '', [ Validators.required, Validators.pattern("([a-zñA-ZÑ]{3,4})+([0-9]{6})+([a-zñA-ZÑ0-9]{3})") ] ),
                   'persona'    : new FormControl( '', [ Validators.required ] ),
                   'banco'      : new FormControl( '', [ Validators.required, Validators.minLength(1) ] ),
                   'clabe'      : new FormControl( '', [ Validators.required, Validators.pattern("[0-9]{18}") ] ),
                   'archivo'    : new FormControl( null, [ Validators.required ] ),
                   'calle'      : new FormControl( '', [ Validators.required, Validators.minLength(5) ] ),
                   'cp'         : new FormControl( '', [ Validators.required, Validators.pattern("[0-9]{5}") ] ),
                   'colonia'    : new FormControl( '', [ Validators.required, Validators.minLength(2) ] ),
                   'municipio'  : new FormControl( '', [ Validators.required, Validators.minLength(4) ] ),
                   'comision'   : new FormControl( 0, [] ),
                   'comision10' : new FormControl( 0, [] ),
                   'cuentas'    : new FormControl( null, [] ),
                 })
               }

  ngOnInit() {
    this.listadoMedicos();
    // console.log(this.usuario);
  }

  listadoMedicos(){
    this.buscando = true;
    this._busquedas.listadoMedicos( this.usuario.USU_id )
                   .subscribe( data =>{
                     // console.log(data);
                     if ( data.length > 0 ) {
                       this.listadoUsuarios = data;
                     }
                     this.buscando = false;
                   })
  }

  activareg(tipo){
    this.tipoReg = tipo;
    this.registro = !this.registro;
    if ( this.registro === false ) {
        this.limpiaFormulario();
    }
  }

  guardaUsuario(){
    if (this.formReg.valid) {
      this.trabajando = true;

      if (this.cuentas.length===0) {
        let cuenta={
          banco: this.mayusculas(this.formReg.controls['banco'].value),
          clabe: this.formReg.controls['clabe'].value,
          archivo: this.formReg.controls['archivo'].value
        }
        this.cuentas.push( cuenta );
        this.formReg.controls['cuentas'].setValue( this.cuentas );

        this.formReg.controls['banco'].setValue(null);
        this.formReg.controls['clabe'].setValue(null);
        this.formReg.controls['archivo'].setValue(null);
      }

      let datos = {
        tipo        : this.tipoReg,
        username    : this.minusculas( this.formReg.controls['username'].value ),
        password    : this.formReg.controls['password'].value,
        nombre      : this.mayusculas( this.formReg.controls['nombre'].value ),
        paterno     : this.mayusculas( this.formReg.controls['paterno'].value ),
        materno     : this.mayusculas( this.formReg.controls['materno'].value ),
        telFijo     : this.formReg.controls['telFijo'].value,
        telMovil    : this.formReg.controls['telMovil'].value,
        email       : this.minusculas( this.formReg.controls['email'].value ),
        rfc         : this.mayusculas( this.formReg.controls['rfc'].value ),
        persona     : this.formReg.controls['persona'].value,
        banco       : this.formReg.controls['banco'].value,
        clabe       : this.formReg.controls['clabe'].value,
        archivo     : this.formReg.controls['archivo'].value,
        calle       : this.mayusculas( this.formReg.controls['calle'].value ),
        cp          : this.formReg.controls['cp'].value,
        colonia     : this.mayusculas( this.formReg.controls['colonia'].value ),
        municipio   : this.mayusculas( this.formReg.controls['municipio'].value ),
        comision    : this.formReg.controls['comision'].value,
        comision10  : this.formReg.controls['comision10'].value,
        cuentas     : this.formReg.controls['cuentas'].value,
        USU_creador : this.usuario.USU_id
      }
      console.log( datos );
      this._operacion.guardaUsuario(datos)
                      .subscribe( data =>{
                        console.log(data);
                        this.trabajando = false;
                        if ( data.respuesta == 'username' ) {
                          this.username=true;
                            // alert('el nombre de usuario ya está en uso');
                        } else{
                          this.username=false;
                        }
                        if( data.respuesta === 1 && data.idUsuario > 0 ){
                          this.limpiaFormulario();
                          this.listadoMedicos();
                        }
                      })
    }
  }

  limpiaFormulario(){
    this.tipoReg = '';
    this.registro = false;
    this.username = false;
    this.buscaUsuario = false;
    this.primerBusqueda = false;
    this.cuentas = [];
    this.formReg.reset();
  }

  dialogoArchivo(){
    let elemento = document.getElementById('arhivo');
    elemento.click();
  }

  archivoSeleccionado(event){
    let b64 = null;
    let reader = new FileReader();
    if(event.target.files && event.target.files.length > 0) {
      let file = event.target.files[0];
      reader.readAsDataURL(file);
      reader.onload = () => {
        this.formReg.get('archivo').setValue({
          filename: file.name,
          filetype: file.type,
          value: reader.result.split(',')[1]
        })
      // console.log( this.formReg.controls['archivo'].value );
      };
    }
  }

  mayusculas( dato ){
    return dato.toUpperCase();
  }

  minusculas( dato ){
    return dato.toLowerCase();
  }

  verificaUsername(data){
    if (data.length > 3) {
        this.primerBusqueda=true;
        this.buscaUsuario=true;

        this._busquedas.verificaUsername( this.minusculas(data) )
                        .subscribe( data =>{
                          this.buscaUsuario = false;
                          console.log(data);
                          if ( data > 0 ) {
                              this.username = true;
                          }
                          else{
                            this.username = false;
                          }
                        })
    }
  }

  guardaCuenta(){
    let cuenta={
      banco: this.mayusculas(this.formReg.controls['banco'].value),
      clabe: this.formReg.controls['clabe'].value,
      archivo: this.formReg.controls['archivo'].value
    }
    this.cuentas.push( cuenta );
    this.formReg.controls['cuentas'].setValue( this.cuentas );

    this.formReg.controls['clabe'].reset();
    this.formReg.controls['clabe'].markAsPristine();
    this.formReg.controls['clabe'].markAsUntouched();
    this.formReg.controls['clabe'].setValidators( [ Validators.pattern("[0-9]{18}") ] );

    this.formReg.controls['banco'].reset();
    this.formReg.controls['banco'].markAsPristine();
    this.formReg.controls['banco'].markAsUntouched();
    this.formReg.controls['banco'].setValidators( [ Validators.minLength(1) ] );

    this.formReg.controls['archivo'].reset();
    // this.formReg.controls['archivo'].setValue(null);
    // document.getElementById("filename").value = null;
    $('#filename').val(null);

    // console.log( this.formReg.controls['cuentas'].value );
    if (this.cuentas.length > 1 ) {
      this.nuevaCuenta = false;
      this.formReg.controls['clabe'].setValidators([ Validators.required, Validators.pattern("[0-9]{18}") ]);
      this.formReg.controls['banco'].setValidators([ Validators.required, Validators.minLength(1) ]);
      this.formReg.controls['archivo'].setValidators([ Validators.required ]);
      // this.formReg.controls['clabe'].setValidators( [ Validators.required ] );
      // this.formReg.controls['banco'].setValidators( [ Validators.required ] );
      // console.log(this.formReg.controls['clabe']);
      // console.log(this.formReg.controls['banco']);
      // console.log(this.formReg.controls['archivo']);
    }
    if (this.cuentas.length === 1) {
        this.nuevaCuenta = true;
    }
  }

  formCuenta(){
    this.nuevaCuenta = true;
    this.formReg.controls['banco'].reset();
    this.formReg.controls['banco'].setValue(null);
    // this.formReg.controls['banco'].setValidators( [  ] );
    // this.formReg.controls['banco'].setValidators( [ Validators.required, Validators.minLength(1) ] );
    this.formReg.controls['banco'].invalid;

    this.formReg.controls['clabe'].reset();
    this.formReg.controls['clabe'].setValue(null);
    // this.formReg.controls['clabe'].setValidators( [ Validators.pattern("[0-9]{18}") ] );
    this.formReg.controls['clabe'].invalid;

    this.formReg.controls['archivo'].reset();
    this.formReg.controls['archivo'].setValue(null);
  }

  cancelaCuenta(){
    this.nuevaCuenta = false;
  }

  eliminaCuenta( index ){
    console.log( index );
    this.cuentas.splice(index,1);
    this.formReg.controls['cuentas'].setValue( this.cuentas );
  }

}
