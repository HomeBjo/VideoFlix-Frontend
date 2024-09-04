import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';
import { RouterLink, RouterModule} from '@angular/router';
import { UserService } from '../../services/user-service.service';
import { GUEST_EMAIL, GUEST_PW } from '../../../../config';
import { FooterComponent } from "../../shared/login/footer/footer.component";
import { HeaderComponent } from "../../shared/login/header/header.component";

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [FormsModule, CommonModule, RouterModule, RouterLink, FooterComponent, HeaderComponent],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss',
})
export class LoginComponent {

  currentChannel: string = '';
  password: string = '';
  GUEST_MAIL : string = GUEST_EMAIL;
  GUEST_PW : string = GUEST_PW;
  passwordFieldType: string = 'password';


  constructor(
    public userService: UserService,
  ) {}

  ngOnInit() {
    this.userService.checkGuestUser();
  }


  async login() {
    this.loadLogin(this.userService.user_email, this.password);
  }


  guestLogin() {
    this.loadLogin(this.GUEST_MAIL, this.GUEST_PW);
  }


  async loadLogin(email: string, password: string) {
    try {
      const user = await this.userService.login(email, password);
      if (user) {
        localStorage.setItem('token', user.token);
        localStorage.setItem('userId', user.user_id.toString());
      } else {
        console.error(
          'Login fehlgeschlagen: Kein gültiges Token oder User-ID erhalten.'
        );
      }
    } catch (error) {
      console.error('Fehler beim Login:', error);
    }
  }
  checkEmail(): boolean {
    const emailPattern = /^[^@]+@[^\.]+\..+$/;
    if (this.userService.user_email.length >= 5 && emailPattern.test(this.userService.user_email)) {
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

  checkAllInputs() {
    if (
      this.checkEmail() &&
      this.checkPassword()
    ) {
      return true;
    }
    return false;
  }

  onSubmit(ngForm: NgForm) {
    if (ngForm.valid && this.checkAllInputs()) {
      this.loadLogin(this.userService.user_email, this.password);
    } else {
      ngForm.resetForm();
    }
  }

  togglePasswordVisibility(): void {
    this.passwordFieldType =
      this.passwordFieldType === 'password' ? 'text' : 'password';
  }
}
