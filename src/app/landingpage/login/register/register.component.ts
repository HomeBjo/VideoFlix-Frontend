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

  /**
   * Toggles the visibility of the password field between 'text' and 'password'.
   */
  togglePasswordVisibility(): void {
    this.passwordFieldType =
      this.passwordFieldType === 'password' ? 'text' : 'password';
  }

  /**
   * Toggles the visibility of the confirm password field between 'text' and 'password'.
   */
  toggleConfirmPasswordVisibility(): void {
    this.confirmPasswordFieldType =
      this.confirmPasswordFieldType === 'password' ? 'text' : 'password';
  }

  /**
   * Validates if the first name has a minimum length of 3 characters.
   * @returns {boolean} - Returns true if the first name is valid.
   */
  checkFirstName() {
    if (this.first_name.length >= 3) {
      return true;
    }
    return false;
  }

  /**
   * Validates if the last name has a minimum length of 3 characters.
   * @returns {boolean} - Returns true if the last name is valid.
   */
  checkLastName() {
    if (this.last_name.length >= 3) {
      return true;
    }
    return false;
  }

  /**
   * Validates if the email entered is in a proper format and length.
   * @returns {boolean} - Returns true if the email is valid.
   */
  checkEmail(): boolean {
    const emailPattern = /^[^@]+@[^\.]+\..+$/;
    if (this.userService.user_email.length >= 5 && emailPattern.test(this.userService.user_email)) {
      return true;
    }
    return false;
  }

  /**
   * Validates if the password has a minimum length of 5 characters.
   * @returns {boolean} - Returns true if the password is valid.
   */
  checkPassword() {
    if (this.password.length >= 5) {
      return true;
    }
    return false;
  }

  /**
   * Returns an error message based on the validation of the last name.
   * @param {string} last_name - The last name to validate.
   * @returns {string} - Error message based on the validation result.
   */
  getLastNameError(last_name: string): string {
    if (this.checkNameLength(last_name)) {
        return 'tooLong';
    } else if (last_name === '') {
        return 'required';
    } else {
        return 'tooShort';
    }
}

  /**
   * Checks if the provided name exceeds the maximum allowed length.
   * @param {string} name - The name to check.
   * @returns {boolean} - Returns true if the name exceeds 20 characters.
   */
  checkNameLength(name: string) {
    if (name.length >= 20) {
      return true;
    }
    return false;
  }

   /**
   * Validates if the confirmation password has a minimum length of 5 characters.
   * @returns {boolean} - Returns true if the confirmation password is valid.
   */ 
  checkConfirmPassword() {
    if (this.confirm_password.length >= 5) {
      return true;
    }
    return false;
  }

  /**
   * Checks if the password and confirmation password match.
   * @returns {boolean} - Returns true if both passwords match.
   */
  checkEvenPasswords() {
    if (this.password === this.confirm_password) {
      return true;
    }
    return false;
  }

  /**
   * Registers the new user with the provided details.
   * Resets the form if the registration is successful.
   */
  async registerUser() {
    const currentHost = this.getHost();
    let newUSer: RegisterUser = {
      username: this.first_name + '_' + this.last_name,
      first_name: this.first_name,
      last_name: this.last_name,
      email: this.userService.user_email,
      password: this.password,
      confirm_password: this.confirm_password,
      domain_user: currentHost
    };
    let done = this.userService.registerUser(newUSer);
    if (await done) {
      this.resetValues();
    }
  }

  /**
   * Check the url to determine the host.
   */
  getHost(){
    const currentHost = window.location.host;
    if (currentHost.includes("videoflix.aleksanderdemyanovych.de")) {
      return 1;
    } else if (currentHost.includes("videoflix.xn--bjrnteneicken-jmb.de")) {
      return 2;
    } else {
      return 0;
    }
  }

 /**
   * Resets the form fields.
   */
  resetValues() {
    this.first_name = '';
    this.last_name = '';
    this.userService.user_email = '';
    this.password = '';
    this.confirm_password = '';
  }

  /**
   * Validates all form inputs (first name, last name, email, password, and confirmation).
   * @returns {boolean} - Returns true if all inputs are valid.
   */
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

 /**
   * Handles form submission and triggers the user registration process if all inputs are valid.
   * @param {NgForm} ngForm - The form object containing the user's input.
   */
  onSubmit(ngForm: NgForm) {
    if (ngForm.valid && this.checkAllInputs()) {
      this.registerUser();
    } else {
      ngForm.resetForm();
    }
  }
}
