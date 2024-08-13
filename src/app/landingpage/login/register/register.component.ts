import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { UserService } from '../../../services/user-service.service';
import { RegisterUser } from '../../../interfaces/register-user';
@Component({
  selector: 'app-register',
  standalone: true,
  imports: [FormsModule, CommonModule, RouterLink],
  templateUrl: './register.component.html',
  styleUrl: './register.component.scss'
})
export class RegisterComponent {


  first_name:string = '';
  last_name:string = '';
  email:string = '';
  password:string = '';
  confirm_password:string = '';
  passwordFieldType: string = 'password';
  confirmPasswordFieldType: string = 'password';


  constructor(public userService: UserService) { }


  togglePasswordVisibility(): void {
    this.passwordFieldType = this.passwordFieldType === 'password' ? 'text' : 'password';
}

  toggleConfirmPasswordVisibility(): void {
    this.confirmPasswordFieldType = this.confirmPasswordFieldType === 'password' ? 'text' : 'password';
}


  registerUser(){
    let newUSer:RegisterUser = {
      username: this.first_name + '_' + this.last_name,
      first_name: this.first_name,
      last_name: this.last_name,
      email: this.userService.user_email,
      password: this.password,
      confirm_password: this.confirm_password
    }
    this.userService.registerUser(newUSer);
    this.resetValues();
  }


  resetValues(){
    this.first_name = '';
    this.last_name = '';
    this.userService.user_email = '';
    this.password = '';
    this.confirm_password = '';
  }
}
