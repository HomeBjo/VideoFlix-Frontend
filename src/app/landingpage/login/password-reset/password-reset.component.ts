import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { FooterComponent } from '../../../shared/login/footer/footer.component';
import { HeaderComponent } from '../../../shared/login/header/header.component';
import { UserService } from '../../../services/user-service.service';
import { RegisterUser } from '../../../interfaces/register-user';

@Component({
  selector: 'app-password-reset',
  standalone: true,
  imports: [FormsModule, CommonModule, RouterLink, FooterComponent, HeaderComponent, HeaderComponent],

  templateUrl: './password-reset.component.html',
  styleUrl: './password-reset.component.scss'
})
export class PasswordResetComponent {
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

async setNewPassword() {
  
    
   this.password,
   this.confirm_password,
   console.log(this.password,this.confirm_password)

}

resetValues() {
  this.password = '';
  this.confirm_password = '';
}

checkAllInputs() {
  if (
    this.checkPassword() &&
    this.checkConfirmPassword() &&
    this.checkEvenPasswords()
  ) {
    return true;
  }
  return false;
}

async onSubmit(ngForm: NgForm) {
  if (ngForm.valid && this.checkAllInputs()) {
    await this.setNewPassword(); 
    ngForm.resetForm(); 
  } else {
    ngForm.resetForm();
  }
}
}
