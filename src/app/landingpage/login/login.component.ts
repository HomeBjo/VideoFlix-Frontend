import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink, RouterModule } from '@angular/router';
import { UserService } from '../../services/user-service.service';
import { VideoService } from '../../services/video-service.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [FormsModule, CommonModule, RouterModule, RouterLink],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})
export class LoginComponent {
  currentChannel: string = '';
  email: string = '';
  password: string = '';
  
  constructor(public userService: UserService, private route: Router,
    private router: ActivatedRoute, private videoService: VideoService) {}

  ngOnInit() {
    this.ifUserLogin();
    this.routeUserId();
    // this.videoService.startFetchVideo();
  }


  ifUserLogin() {
    if (this.userService.getCurrentUserId()) {
      this.route.navigateByUrl('/login');
    }
  }


  routeUserId() { //ist reinkoppiert - später nachgucken obs überhaut benötigt wird
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
        localStorage.setItem('authUser', user.token);
        localStorage.setItem('userId', user.user_id.toString());
      } else {
        console.error('Login fehlgeschlagen: Kein gültiges Token oder User-ID erhalten.');
      }
    } catch (error) {
      console.error('Fehler beim Login:', error);
    }
  }
  


  guestLogin(){}
}
