import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { UserService } from '../../../../services/user-service.service';

@Component({
  selector: 'app-email-exists',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './email-exists.component.html',
  styleUrl: './email-exists.component.scss'
})
export class EmailExistsComponent {

}
