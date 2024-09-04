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
    private router: Router
  ) {}

  togglePasswordVisibility(): void {
    this.passwordFieldType =
      this.passwordFieldType === 'password' ? 'text' : 'password';
  }

  toggleConfirmPasswordVisibility(): void {
    this.confirmPasswordFieldType =
      this.confirmPasswordFieldType === 'password' ? 'text' : 'password';
  }

  checkPassword() {
    return this.password && this.password.length >= 5;
  }

  checkConfirmPassword() {
    return this.confirm_password && this.confirm_password.length >= 5;
  }

  checkEvenPasswords() {
    if (this.password === this.confirm_password) {
      return true;
    }
    return false;
  }

  async setNewPassword() {
    const uid = this.route.snapshot.paramMap.get('uid');
    const token = this.route.snapshot.paramMap.get('token');

    const success = await this.userService.sendNewPassword(
      this.confirm_password,
      uid,
      token
    );
    if (success) {
      console.log('Passwort wurde erfolgreich zurückgesetzt.');
      return true;
      // this.router.navigateByUrl('/login');
    } else {
    
      console.log('Fehler beim Zurücksetzen des Passworts.');
      console.log(this.confirm_password, uid, token);
      return false;
    }
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
      try {
        const success = await this.setNewPassword();
        // ngForm.resetForm();
        if (success) {
          this.passwordSent = true;
        }
      } catch (error) {
        // ngForm.resetForm();
      }
    }
  }
}
