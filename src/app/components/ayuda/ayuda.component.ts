import { Component, OnInit } from '@angular/core';
import { AuthService } from "../../services/auth.service";

@Component({
  selector: 'app-ayuda',
  templateUrl: './ayuda.component.html'
})
export class AyudaComponent implements OnInit {

  constructor( public _authService:AuthService ) { }

  ngOnInit() {
  }

}
