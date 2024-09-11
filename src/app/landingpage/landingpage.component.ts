import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { UserService } from '../services/user-service.service';
import { HeaderComponent } from "../shared/login/header/header.component";

@Component({
  selector: 'app-landingpage',
  standalone: true,
  imports: [FormsModule, CommonModule, RouterLink, HeaderComponent],
  templateUrl: './landingpage.component.html',
  styleUrl: './landingpage.component.scss'
})
export class LandingpageComponent {

  constructor(public userService: UserService) { }

    /**
   * Lifecycle hook that is called after the component is initialized.
   * Calls the UserService to check if the current user is a guest user.
   */
    ngOnInit() {
      this.userService.checkGuestUser();
    }
}
