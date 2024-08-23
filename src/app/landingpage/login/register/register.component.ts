import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { UserService } from '../../../services/user-service.service';
import { RegisterUser } from '../../../interfaces/register-user';
import { HeaderComponent } from "../../../shared/login/header/header.component";
import { FooterComponent } from '../../../shared/login/footer/footer.component';
@Component({
  selector: 'app-register',
  standalone: true,
  imports: [FormsModule, CommonModule, RouterLink, FooterComponent, HeaderComponent],
  templateUrl: './register.component.html',
  styleUrl: './register.component.scss',
})
export class RegisterComponent {
  
  first_name: string = '';
  last_name: string = '';
  password: string = '';
  confirm_password: string = '';
  passwordFieldType: string = 'password';
  confirmPasswordFieldType: string = 'password';


  constructor(public userService: UserService) {}


  togglePasswordVisibility(): void {
    this.passwordFieldType =
      this.passwordFieldType === 'password' ? 'text' : 'password';
  }


  toggleConfirmPasswordVisibility(): void {
    this.confirmPasswordFieldType =
      this.confirmPasswordFieldType === 'password' ? 'text' : 'password';
  }


  checkFirstName() {
    if (this.first_name.length >= 3) {
      return true;
    }
    return false;
  }


  checkLastName() {
    if (this.last_name.length >= 3) {
      return true;
    }
    return false;
  }


  checkEmail() {
    if (this.userService.user_email.length >= 5) {
      return true;
    }
    return false;
  }


  checkPassword() {
    if (this.password.length >= 5) {
      return true;
    }
    return false;
  }


  checkConfirmPassword() {
    if (this.confirm_password.length >= 5) {
      return true;
    }
    return false;
  }


  checkEvenPasswords() {
    if (this.password === this.confirm_password) {
      return true;
    }
    return false;
  }


  async registerUser() {
    let newUSer: RegisterUser = {
      username: this.first_name + '_' + this.last_name,
      first_name: this.first_name,
      last_name: this.last_name,
      email: this.userService.user_email,
      password: this.password,
      confirm_password: this.confirm_password,
    };
    let done = this.userService.registerUser(newUSer);
    if (await done) {
      this.resetValues();
    }
  }


  resetValues() {
    this.first_name = '';
    this.last_name = '';
    this.userService.user_email = '';
    this.password = '';
    this.confirm_password = '';
  }


  checkAllInputs() {
    if (
      this.checkFirstName() &&
      this.checkLastName() &&
      this.checkEmail() &&
      this.checkPassword() &&
      this.checkConfirmPassword() &&
      this.checkEvenPasswords()
    ) {
      return true;
    }
    return false;
  }


  onSubmit(ngForm: NgForm) {
    if (ngForm.valid && this.checkAllInputs()) {
      this.registerUser();
    } else {
      ngForm.resetForm();
    }
  }
}
