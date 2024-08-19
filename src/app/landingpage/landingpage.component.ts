import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { UserService } from '../services/user-service.service';

@Component({
  selector: 'app-landingpage',
  standalone: true,
  imports: [FormsModule, CommonModule, RouterLink],
  templateUrl: './landingpage.component.html',
  styleUrl: './landingpage.component.scss'
})
export class LandingpageComponent {

  constructor(public userService: UserService) { }

    ngOnInit() {
      this.userService.checkGuestUser();
    }
}
