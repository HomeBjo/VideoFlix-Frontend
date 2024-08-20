import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { FooterComponent } from '../../../shared/login/footer/footer.component';
import { HeaderComponent } from '../../../shared/login/header/header.component';
import { UserService } from '../../../services/user-service.service';

@Component({
  selector: 'app-email-send',
  standalone: true,
  imports: [FormsModule, CommonModule, RouterLink, FooterComponent, HeaderComponent, HeaderComponent],
  templateUrl: './email-send.component.html',
  styleUrl: './email-send.component.scss'
})
export class EmailSendComponent {
  email: string = '';
  constructor(public userService: UserService) {}


  

  
 

  checkEmail() {
    if (this.email.length >= 5) {
      return true;
    }
    return false;
  }
  

  
  async sendEmail() {
    
      
     this.email,
     
     console.log(this.email,)
  
  }

  checkAllInputs() {
    if (
      this.checkEmail()
    ) {
      return true;
    }
    return false;
  }
  
  async onSubmit(ngForm: NgForm) {
    if (ngForm.valid && this.checkAllInputs()) {
      await this.sendEmail(); 
      ngForm.resetForm(); 
    } else {
      ngForm.resetForm();
    }
  }
  }
  
