import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component } from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';
import { UserService } from '../../../services/user-service.service';
import { Router, RouterLink } from '@angular/router';
import { FooterComponent } from "../../../shared/login/footer/footer.component";
import { UserData } from '../../../interfaces/user-data';
import { UserArrayData } from '../../../interfaces/user-details-data';

@Component({
  selector: 'app-profile-details',
  standalone: true,
  imports: [FormsModule, CommonModule, FooterComponent, RouterLink],
  templateUrl: './profile-details.component.html',
  styleUrl: './profile-details.component.scss'
})
export class ProfileDetailsComponent {
  
  changeFirstname: boolean = false;
  profileFields: UserArrayData [] = [];
  enableBtn: boolean = false;
  continueMessage:boolean = false;

  constructor(public userService: UserService, private router: Router, private cdr: ChangeDetectorRef) { }
  
  /**
   * Lifecycle hook that is called after the component is initialized.
   * Fetches user data and sets up the profile fields.
   */
  async ngOnInit() {
    await this.userService.getUserData();
    this.userService.userData$.subscribe((userData: UserData[] | null) => { 
      if (userData) { 
        const user = userData[0];
        this.profileFields = [
          { name: 'Firstname', value: user.first_name || 'This field is empty', originalValue: user.first_name, placeholder: 'Firstname (required)', isEditing: false, inputType: 'text' },
          { name: 'Lastname', value: user.last_name || 'This field is empty', originalValue: user.last_name, placeholder: 'Lastname (required)', isEditing: false, inputType: 'text' },
          { name: 'Email', value: user.email || 'This field is empty', originalValue: user.email, placeholder: 'Email (required)', isEditing: false, inputType: 'email' },
          { name: 'Phone', value: user.phone || 'This field is empty', originalValue: user.phone, placeholder: 'Phone (optional)', isEditing: false, inputType: 'tel' },
          { name: 'Address', value: user.address || 'This field is empty', originalValue: user.address, placeholder: 'Address (optional)', isEditing: false, inputType: 'text' },
        ];
      this.cdr.detectChanges();
      }
    });  
  }

  /**
   * Toggles the editing state of the first name field.
   */
  changeFirstName(){
    this.changeFirstname = !this.changeFirstname;
  }

  /**
   * Toggles the editing state of a specific profile field and validates the form.
   * @param {number} index - The index of the field to toggle.
   */
  toggleEdit(index: number) {
    this.profileFields[index].isEditing = !this.profileFields[index].isEditing;
    if (!this.profileFields[index].isEditing) {
      this.enableBtn = true;
      this.isFormValid();
    }
  }
  
  /**
   * Checks if any profile field is currently being edited.
   * @returns {boolean} - Returns true if any fields are in edit mode.
   */
  showCheckWarning() {
    return this.profileFields.some(field => field.isEditing);
  }

    /**
   * Navigates back to the video site page.
   */
  back() {
    this.router.navigateByUrl('/video_site'); 
  }

  /**
   * Validates the length of a field's value.
   * @param {number} i - The index of the field to validate.
   * @returns {boolean} - Returns true if the value length is valid.
   */
  checkLenght(i : number): boolean {
    const value = this.profileFields[i].value;
    if (typeof value === 'string') {
      return value.length >= 3;
    }
    return false;
  }

  /**
   * Checks if the value of a specific name field exceeds the maximum length.
   * @param {number} i - The index of the field to check.
   * @returns {boolean} - Returns true if the name is longer than 20 characters.
   */
  checkIfNameIsTooLong(i : number): boolean {
    const value = this.profileFields[i].value;
    if (typeof value === 'string') {
      return value.length >= 20;
    }
    return false;
  }

  /**
   * Checks if any fields are currently being edited.
   * @returns {boolean} - Returns true if any fields are being edited.
   */
  checkIfInputsChecked(): boolean { 
    return this.profileFields.some(field => field.isEditing);
  }

  /**
   * Checks if a specific profile field is empty.
   * @param {number} i - The index of the field to check.
   * @returns {boolean} - Returns true if the field is empty.
   */
  checkIfFieldIsEmpty(i: number): boolean {
    if (this.profileFields[i].value === 'This field is empty') {
      return true;
    }
    return false;
  }

  /**
   * Validates the format of the email field.
   * @param {number} i - The index of the field to validate.
   * @returns {boolean} - Returns true if the email format is valid.
   */
  checkEmailFormat(i: number): boolean {
    if (i === 2) {
      const email = this.profileFields[i].value as string;
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      return emailRegex.test(email);
    }
    return false;
  }

  /**
   * Validates the format of the phone field.
   * @param {number} i - The index of the field to validate.
   * @returns {boolean} - Returns true if the phone format is valid.
   */
  checkPhoneFormat(i: number): boolean {
    if (i === 3) {

      if (this.checkIfFieldIsEmpty(i)) {
        return true;
      }
      const phone = this.profileFields[i].value as string;
      const cleanedPhone = phone.replace(/[\s\-\(\)]+/g, '');
      const isValid = /^\d{7,15}$/.test(cleanedPhone);   
      if (isValid || this.profileFields[i].value == '') {
        return true; 
      }
      return isValid;
    }
    
    return false;
  }

  /**
   * Validates the form by checking all fields and ensuring that no edits are in progress.
   * @returns {boolean} - Returns true if the form is valid.
   */
  isFormValid(): boolean {
    if (!this.enableBtn) {
      return false;
    }

    const allFieldsValid = this.checkAllFieldsValidthis();
    const noEditingInProgress = !this.checkIfInputsChecked(); 
    const hasChangedValues = this.profileFields.some(field => field.value !== field.originalValue);
    if (hasChangedValues) {
      this.enableBtn = true;
    }
    
    return allFieldsValid && noEditingInProgress && hasChangedValues && this.enableBtn;
  }

  /**
   * Checks if all profile fields are valid.
   * @returns {boolean} - Returns true if all fields are valid.
   */
  checkAllFieldsValidthis(){
    return this.profileFields.every((field, index) => {
      if (index === 0 || index === 1) {
          return this.checkLenght(index);
      } else if (index === 2) {
          return this.checkEmailFormat(index);
      } else if (index === 3) {
          return this.checkPhoneFormat(index);
      }
      return true;
    });
  }

  /**
   * Handles form submission and calls the saveData function if the form is valid.
   * @param {NgForm} ngForm - The form object containing the user's input.
   */
  onSubmit(ngForm: NgForm) {
    if (ngForm.valid) {
      this.saveData();
    } else {
    }
  }

  /**
   * Saves the updated user data to the server by calling the `updateUserData` method from `UserService`.
   */
  async saveData(){
    let userID = localStorage.getItem('userId');
    if (userID) {
      let newUserData: UserData = { 
        id: +userID,
        first_name : this.profileFields[0].value as string,
        last_name: this.profileFields[1].value as string,
        email: this.profileFields[2].value as string,
        phone: this.profileFields[3].value as number,
        address: this.profileFields[4].value as string,
        username: (this.profileFields[0].value + '_' + this.profileFields[1].value) as string
      }
      let done = await this.userService.updateUserData(newUserData);
      if (done) {
        this.continueMessage = true;
      } else {
        this.continueMessage = false;
      }
    }
  }
}
