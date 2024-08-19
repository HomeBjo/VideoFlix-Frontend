import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import {
  ActivatedRoute,
  RouterLink,
  RouterModule,
} from '@angular/router';
import { UserService } from '../../services/user-service.service';

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

  constructor(
    public userService: UserService,
    private router: ActivatedRoute,
  ) {}

  ngOnInit() {
    this.userService.checkGuestUser();
    this.routeUserId();
  }

  routeUserId() {
    //ist reinkoppiert - später nachgucken obs überhaut benötigt wird
    if (this.router.params.subscribe()) {
      this.router.params.subscribe((params) => {
        this.currentChannel = params['id'];
      });
    }
  }

  async login() {
    try {
      const user = await this.userService.login(this.email, this.password);
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

  guestLogin() {}
}
