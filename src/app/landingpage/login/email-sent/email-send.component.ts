import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { FooterComponent } from '../../../shared/login/footer/footer.component';
import { HeaderComponent } from '../../../shared/login/header/header.component';
import { UserService } from '../../../services/user-service.service';

@Component({
  selector: 'app-email-send',
  standalone: true,
  imports: [
    FormsModule,
    CommonModule,
    RouterLink,
    FooterComponent,
    HeaderComponent,
    HeaderComponent,
  ],
  templateUrl: './email-send.component.html',
  styleUrl: './email-send.component.scss',
})
export class EmailSendComponent {
  email: string = '';
  emailSent: boolean = false;
  constructor(public userService: UserService, private router: Router) {}

  checkEmail(): boolean {
    const emailPattern = /^[^@]+@[^\.]+\..+$/;

    if (emailPattern.test(this.email)) {
      return true;
    }

    return false;
  }

  async onSubmit(form: NgForm) {
    if (this.checkEmail()) {
      try {
        const success = await this.userService.sendPasswordResetEmail(
          this.email
        );
        if (success) {
          this.emailSent = true; //bei erfolg den anderen container anzeigen
        }
      } catch (error) {}
    }
  }
}
