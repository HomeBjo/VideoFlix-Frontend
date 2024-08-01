import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [FormsModule, CommonModule, RouterLink],
  templateUrl: './register.component.html',
  styleUrl: './register.component.scss'
})
export class RegisterComponent {

  shown_name:string = '';
  first_name:string = '';
  last_name:string = '';
  email:string = '';
  phone:number = 0;
  password:string = '';
  confirm_password:string = '';



  constructor() { }


  registerUser(){}


}
