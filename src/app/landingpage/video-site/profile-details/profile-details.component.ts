import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component } from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';
import { UserService } from '../../../services/user-service.service';
import { Router } from '@angular/router';
import { FooterComponent } from "../../../shared/login/footer/footer.component";
import { UserData } from '../../../interfaces/user-data';
import { UserArrayData } from '../../../interfaces/user-details-data';

@Component({
  selector: 'app-profile-details',
  standalone: true,
  imports: [FormsModule, CommonModule, FooterComponent],
  templateUrl: './profile-details.component.html',
  styleUrl: './profile-details.component.scss'
})
export class ProfileDetailsComponent {
  
  changeFirstname: boolean = false;
  profileFields: UserArrayData [] = [];
  allInputsChecked: boolean = false;
  valuesChanged: boolean = false;
  showCheckWarningBoolean: boolean = false;

  constructor(public userService: UserService, private router: Router, private cdr: ChangeDetectorRef) { }
  

  // async ngOnInit() {
  //   await this.userService.getUserData(); //lade die daten erneut (wenn user die seite zB reloadet)
  //   this.userService.userData$.subscribe((userData: UserData[] | null) => { //abonniere die daten - sobald die verfügbar sind, werden die ausgelesen
  //     if (userData) { //wenn daten vorhanden -> zuweisen
  //       const user = userData[0];
  //       this.profileFields = [
  //         { name: 'Firstname', value: user.first_name || 'This field is empty', originalValue: user.first_name, placeholder: 'Firstname (required)', isEditing: false, inputType: 'text' },
  //         { name: 'Lastname', value: user.last_name || 'This field is empty', originalValue: user.last_name, placeholder: 'Lastname (required)', isEditing: false, inputType: 'text' },
  //         { name: 'Email', value: user.email || 'This field is empty', originalValue: user.email, placeholder: 'Email (required)', isEditing: false, inputType: 'email' },
  //         { name: 'Phone', value: user.phone || 'This field is empty', originalValue: user.phone, placeholder: 'Phone (optional)', isEditing: false, inputType: 'tel' },
  //         { name: 'Address', value: user.address || 'This field is empty', originalValue: user.address, placeholder: 'Address (optional)', isEditing: false, inputType: 'text' },
  //       ];
  //     // this.cdr.detectChanges(); //angular überprüft automatisch änderungen
  //     console.log(this.profileFields);
  //     }
  //   });  
  // }

  async ngOnInit() {
    let userData = await this.userService.getUserData(); //lade die daten erneut (wenn user die seite zB reloadet)
      if (userData) { //wenn daten vorhanden -> zuweisen
        const user = userData[0];
        this.profileFields = [
          { name: 'Firstname', value: user.first_name || 'This field is empty', originalValue: user.first_name, placeholder: 'Firstname (required)', isEditing: false, inputType: 'text' },
          { name: 'Lastname', value: user.last_name || 'This field is empty', originalValue: user.last_name, placeholder: 'Lastname (required)', isEditing: false, inputType: 'text' },
          { name: 'Email', value: user.email || 'This field is empty', originalValue: user.email, placeholder: 'Email (required)', isEditing: false, inputType: 'email' },
          { name: 'Phone', value: user.phone || 'This field is empty', originalValue: user.phone, placeholder: 'Phone (optional)', isEditing: false, inputType: 'tel' },
          { name: 'Address', value: user.address || 'This field is empty', originalValue: user.address, placeholder: 'Address (optional)', isEditing: false, inputType: 'text' },
        ];
      this.cdr.detectChanges(); //angular überprüft automatisch änderungen
      console.log(this.profileFields);
      } 
  }


  changeFirstName(){
    this.changeFirstname = !this.changeFirstname;
  }


  toggleEdit(index: number) {
    this.profileFields[index].isEditing = !this.profileFields[index].isEditing;
    console.log(`this.profileFields${index}.isEditing:`,this.profileFields[index].isEditing);
    console.log(this.profileFields);
    console.log(`Value index${index}:`, this.profileFields[index].value);
    // this.cdr.detectChanges();  //angular überprüft automatisch änderungen
  }
  

  
  showCheckWarning() {
    return this.profileFields.some(field => field.isEditing);
  }

  
  back() {
    this.router.navigateByUrl('/video_site');
  }


  // checkAllInputs(){
  //   if (typeof this.profileFields[0].value === 'string' && this.profileFields[0].value.length >= 3 || 
  //     typeof this.profileFields[1].value === 'string' && this.profileFields[1].value.length >= 3 || 
  //     typeof this.profileFields[2].value === 'string' && this.profileFields[2].value.length >= 3) {
    
  //     console.log('All fields are filled!');
  //   }
  // }

  checkLenght(i : number): boolean { //überprüft, ob index 0-2 ein sting ist und  größer 3 Zeichen ist
    const value = this.profileFields[i].value;
    if (i >= 0 && i <= 2 && typeof value === 'string') {
      return value.length >= 3;
    }
    return false;
  }


  onInputChange(newValue: string, index: number) {
    this.profileFields[index].value = newValue;
    console.log(`this.profileFields${index}.value`, this.profileFields[index].value);
    console.log('newValue:', newValue);
    
    this.valuesChanged = this.checkChangedValues();
  }


  checkIfInputsChecked(): boolean { //checkt das array ung guckt ob isEditing = true ist
    return this.profileFields.some(field => field.isEditing);
  }


  checkChangedValues() {
    let value = this.profileFields.some(field => field.value !== field.originalValue);
    if (value) {
      console.log('values changed!');
      return true;
    }
    console.log('values not changed!');
    return false;
  }


  onSubmit(ngForm: NgForm) {
    // if (ngForm.valid && this.checkIfInputsChecked() && this.checkChangedValues()) {
    if (ngForm.valid && this.valuesChanged) {
      this.allInputsChecked = true;
      // this.registerUser();
      this.saveData();
    } else {
      this.allInputsChecked = false;
      ngForm.resetForm();
    }
  }


  saveData(){
    let userID = localStorage.getItem('userId');
    if (userID) {
      let newUserData: UserData = { //überschreibe die alten daten mit den neuen
        id: +userID,
        first_name : this.profileFields[0].value as string,
        last_name: this.profileFields[1].value as string,
        email: this.profileFields[2].value as string,
        phone: this.profileFields[3].value as number,
        address: this.profileFields[4].value as string,
        username: (this.profileFields[0].value + '_' + this.profileFields[1].value) as string
      }
      console.log('newUserData: ',newUserData);
    }
    
  }
}
