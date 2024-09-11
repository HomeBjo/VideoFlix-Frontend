import { CommonModule } from '@angular/common';
import { Component, HostListener } from '@angular/core';
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
  isRememberMeChecked: boolean = false;
  rememberMe: boolean = false;
  questionMartMobile: boolean = false;
  showQesttionDiv: boolean = false;


  constructor(
    public userService: UserService,
  ) {}

  /**
   * Lifecycle hook that runs when the component is initialized.
   * It checks the "Remember Me" status and checks if the user is a guest.
   */
  ngOnInit() {
    this.checkRememberMeDisplayBoolean();
    this.userService.checkGuestUser();
  }

    /**
   * Listens to window resize events and adjusts the display for mobile or desktop views.
   */
  @HostListener('window:resize', ['$event'])
  onWindowResize() {
    this.checkWindowWidth();
  }

    /**
   * Logs the user in with the email and password entered.
   */
  async login() {
    this.loadLogin(this.userService.user_email, this.password);
  }

  /**
   * Logs the user in as a guest using predefined guest email and password.
   */
  guestLogin() {
    this.loadLogin(this.GUEST_MAIL, this.GUEST_PW);
  }

  /**
   * Loads the login process using the provided email and password.
   * 
   * @param {string} email - The email to use for login.
   * @param {string} password - The password to use for login.
   */
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

  /**
   * Validates the email format and length.
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
   * Checks if the password meets the minimum length requirement.
   * @returns {boolean} - Returns true if the password is valid.
   */
  checkPassword() {
    if (this.password.length >= 5) {
      return true;
    }
    return false;
  }

  /**
   * Verifies if both email and password inputs are valid.
   * @returns {boolean} - Returns true if both inputs are valid.
   */
  checkAllInputs() {
    if (this.checkEmail() && this.checkPassword()) {
      return true;
    }
    return false;
  }

  /**
   * Handles form submission and triggers the login process if inputs are valid.
   * 
   * @param {NgForm} ngForm - The form object containing the user's input.
   */
  onSubmit(ngForm: NgForm) {
    if (ngForm.valid && this.checkAllInputs()) {
      this.loadLogin(this.userService.user_email, this.password);
      if (!this.rememberMe) {
        localStorage.setItem('rememberMe', 'false');
      }
    } else {
      ngForm.resetForm();
    }
  }

  /**
   * Toggles the visibility of the password field between 'text' and 'password'.
   */
  togglePasswordVisibility(): void {
    this.passwordFieldType =
      this.passwordFieldType === 'password' ? 'text' : 'password';
  }

  /**
   * Toggles the "Remember Me" option and stores its value in localStorage.
   */
  checkRememberMe(){
    this.rememberMe = !this.rememberMe;
    if (this.rememberMe) {
      localStorage.setItem('rememberMe', 'true');
    } else {
      localStorage.setItem('rememberMe', 'false');
    }
  }

  
  checkRememberMeDisplayBoolean(){
    let remember = localStorage.getItem('rememberMe');
    if (remember === 'true') {
      this.rememberMe = true;
    } else {
      this.rememberMe = false;
    }
  }

  /**
   * Checks if the window width is less than 1200px to adjust for mobile view.
   * @returns {boolean} - Returns true if the window is less than 1200px wide.
   */
  checkWindowWidth(){
    if (window.innerWidth < 1200) {
      return true;
    } else {
      return false;
    }
  }

  /**
   * Toggles the display of the question window.
   */
  showQuestionWindow(){
    this.showQesttionDiv = !this.showQesttionDiv;
  }

}
