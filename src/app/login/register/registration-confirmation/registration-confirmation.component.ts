import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { UserService } from '../../../services/user-service.service';

@Component({
  selector: 'app-registration-confirmation',
  standalone: true,
  imports: [FormsModule,CommonModule],
  templateUrl: './registration-confirmation.component.html',
  styleUrl: './registration-confirmation.component.scss'
})
export class RegistrationConfirmationComponent {

  constructor(public userService: UserService){}

}
