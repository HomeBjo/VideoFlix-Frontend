import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { FooterComponent } from '../../../shared/login/footer/footer.component';
import { HeaderComponent } from '../../../shared/login/header/header.component';
import { UserService } from '../../../services/user-service.service';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-password-reset',
  standalone: true,
  imports: [
    FormsModule,
    CommonModule,
    RouterLink,
    FooterComponent,
    HeaderComponent,
    HeaderComponent,
  ],

  templateUrl: './password-reset.component.html',
  styleUrl: './password-reset.component.scss',
})
export class PasswordResetComponent {
  password: string = '';
  confirm_password: string = '';
  passwordFieldType: string = 'password';
  confirmPasswordFieldType: string = 'password';
  passwordSent: boolean = false;

  constructor(
    public userService: UserService,
    private route: ActivatedRoute,
  ) {}

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
   * Checks if the password entered meets the minimum length requirement (5 characters).
   * @returns {boolean} - Returns true if the password is valid, otherwise false.
   */
  checkPassword() {
    return this.password && this.password.length >= 5;
  }

    /**
   * Checks if the confirm password entered meets the minimum length requirement (5 characters).
   * @returns {boolean} - Returns true if the confirm password is valid, otherwise false.
   */
  checkConfirmPassword() {
    return this.confirm_password && this.confirm_password.length >= 5;
  }

    /**
   * Checks if the password and confirm password fields match.
   * @returns {boolean} - Returns true if both passwords match, otherwise false.
   */
  checkEvenPasswords() {
    if (this.password === this.confirm_password) {
      return true;
    }
    return false;
  }

    /**
   * Sends the new password to the server using the uid and token from the URL parameters.
   * @param {NgForm} ngForm - The form object containing the user's input.
   * @returns {Promise<boolean>} - Returns true if the password reset was successful, otherwise false.
   */
  async setNewPassword(ngForm: NgForm) {
    const uid = this.route.snapshot.paramMap.get('uid');
    const token = this.route.snapshot.paramMap.get('token');

    const success = await this.userService.sendNewPassword(
      this.confirm_password,
      uid,
      token
    );
    if (success) {
      return true;
    } else {
      ngForm.resetForm();
      return false;
    }
  }

    /**
   * Resets the password and confirm password fields.
   */
  resetValues() {
    this.password = '';
    this.confirm_password = '';
  }

    /**
   * Checks all inputs (password, confirm password, and their match).
   * @returns {boolean} - Returns true if all checks pass, otherwise false.
   */
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

    /**
   * Handles form submission and triggers the password reset process if inputs are valid.
   * @param {NgForm} ngForm - The form object containing the user's input.
   */
  async onSubmit(ngForm: NgForm) {
    if (ngForm.valid && this.checkAllInputs()) {
      try {
        const success = await this.setNewPassword(ngForm);
        if (success) {
          localStorage.clear();
          this.passwordSent = true;
        }
      } catch (error) {
      }
    }
  }
}
