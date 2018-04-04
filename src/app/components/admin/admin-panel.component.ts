import { Component, OnInit } from '@angular/core';
import { AuthService } from "../../services/auth.service";
import { BusquedasService } from "../../services/busquedas.service";

@Component({
  selector: 'app-admin-panel',
  templateUrl: './admin-panel.component.html'
})
export class AdminPanelComponent implements OnInit {
  usuario:any = {};

  constructor( public _authService:AuthService,
               private _busquedas:BusquedasService ) { }

  ngOnInit() {
    this.usuario = this._authService.datosUsuario();
  }

}
