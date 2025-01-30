import { Component } from '@angular/core';
import { Location } from '@angular/common';

@Component({
  selector: 'app-c-flechas',
  standalone: true,
  imports: [],
  templateUrl: './c-flechas.component.html',
  styleUrl: './c-flechas.component.css'
})
export class CFlechasComponent {

  constructor(private location: Location){}

  back(){
    this.location.back()
  }

  forward(){
    this.location.forward
  }

}
