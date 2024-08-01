import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink, RouterModule } from '@angular/router';
import { UserService } from '../services/user-service.service';

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
    private router: ActivatedRoute,) {}

  ngOnInit() {
    this.ifUserLogin();
    this.routeUserId();
  }


  ifUserLogin() {
    if (this.userService.getCurrentUserId() === undefined) {
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
}
