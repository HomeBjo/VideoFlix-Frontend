import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterLink, RouterModule} from '@angular/router';
import { UserService } from '../../services/user-service.service';
import { GUEST_EMAIL, GUEST_PW } from '../../../../config';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [FormsModule, CommonModule, RouterModule, RouterLink],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss',
})
export class LoginComponent {

  currentChannel: string = '';
  email: string = '';
  password: string = '';
  GUEST_MAIL : string = GUEST_EMAIL;
  GUEST_PW : string = GUEST_PW;


  constructor(
    public userService: UserService,
  ) {}

  ngOnInit() {
    this.userService.checkGuestUser();
  }


  async login() {
    this.loadLogin(this.email, this.password);
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
}
