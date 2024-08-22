import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { UserService } from '../../../services/user-service.service';
import { Router } from '@angular/router';
import { FooterComponent } from "../../../shared/login/footer/footer.component";
import { UserData } from '../../../interfaces/user-data';
import { UserDetailsData } from '../../../interfaces/user-details-data';

@Component({
  selector: 'app-profile-details',
  standalone: true,
  imports: [FormsModule, CommonModule, FooterComponent],
  templateUrl: './profile-details.component.html',
  styleUrl: './profile-details.component.scss'
})
export class ProfileDetailsComponent {
  
  changeFirstname: boolean = false;
  profileFields: UserDetailsData [] = [];
  
  constructor(public userService: UserService, private router: Router) { }
  

  async ngOnInit() {
    await this.userService.getUserData(); //lade die daten erneut (wenn user die seite zB reloadet)
    this.userService.userData$.subscribe((userData: UserData[] | null) => { //abonniere die daten
      console.log('userData: ',userData);
      
      if (userData) { //wenn daten vorhanden -> zuweisen
        const user = userData[0];
        this.profileFields = [
          { name: 'Firstname', value: user.first_name ? user.first_name : '', placeholder: 'Firstname (required)', isEditing: false, inputType: 'text' },
          { name: 'Lastname', value: user.last_name ? user.last_name : '', placeholder: 'Lastname (required)', isEditing: false, inputType: 'text' },
          { name: 'Email', value: user.email ? user.email : '', placeholder: 'Email (required)', isEditing: false, inputType: 'email' },
          { name: 'Phone', value: user.phone ? user.phone : '', placeholder: 'Phone (optional)', isEditing: false, inputType: 'tel' },
          { name: 'Address', value: user.address ? user.address : '', placeholder: 'Address (optional)', isEditing: false, inputType: 'text' },
        ];
      }
    });  
  }


  changeFirstName(){
    this.changeFirstname = !this.changeFirstname;
  }


  toggleEdit(index: number) {
    this.profileFields[index].isEditing = !this.profileFields[index].isEditing;
  }
  
  
  back() {
    this.router.navigateByUrl('/video_site');
  }


  saveData(){
    
  }
}
