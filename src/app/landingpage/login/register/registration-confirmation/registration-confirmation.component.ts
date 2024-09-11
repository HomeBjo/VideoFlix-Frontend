import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { UserService } from '../../../../services/user-service.service';
import { RouterLink } from '@angular/router';
import { FooterComponent } from "../../../../shared/login/footer/footer.component";
import { HeaderComponent } from "../../../../shared/login/header/header.component";

@Component({
  selector: 'app-registration-confirmation',
  standalone: true,
  imports: [FormsModule, CommonModule, RouterLink, FooterComponent, HeaderComponent],
  templateUrl: './registration-confirmation.component.html',
  styleUrl: './registration-confirmation.component.scss'
})
export class RegistrationConfirmationComponent {

  constructor(public userService: UserService){}

    /**
   * Lifecycle hook that is called when the component is destroyed.
   * It resets the user name and email copy fields in the UserService.
   */
  ngOnDestroy(): void {
    this.userService.user_name = '';
    this.userService.user_email_copy = '';
  }

}
