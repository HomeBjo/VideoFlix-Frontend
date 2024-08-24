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
  

  async ngOnInit() {
    await this.userService.getUserData(); //lade die daten erneut (wenn user die seite zB reloadet)
    this.userService.userData$.subscribe((userData: UserData[] | null) => { //abonniere die daten - sobald die verfügbar sind, werden die ausgelesen
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
    });  
  }


  changeFirstName(){
    this.changeFirstname = !this.changeFirstname;
  }


  toggleEdit(index: number) {
    this.profileFields[index].isEditing = !this.profileFields[index].isEditing;
    if (!this.profileFields[index].isEditing) {
      this.enableBtn = true;
      this.isFormValid(); //überprüfe, ob der btn enabeld werden kann
    }
  }
  

  showCheckWarning() { // zeigt check warnung an
    return this.profileFields.some(field => field.isEditing);
  }

  
  back() {
    this.router.navigateByUrl('/video_site');
  }


  checkLenght(i : number): boolean { //überprüft, ob index 0-2 ein sting ist und  größer 3 Zeichen ist
    const value = this.profileFields[i].value;
    if (typeof value === 'string') {
      return value.length >= 3;
    }
    return false;
  }


  checkIfInputsChecked(): boolean { //checkt das array ung guckt ob isEditing = true ist
    return this.profileFields.some(field => field.isEditing);
  }


  checkIfFieldIsEmpty(i: number): boolean { //checkt, ob ein Feld den standart text hat
    if (this.profileFields[i].value === 'This field is empty') {
      return true;
    }
    return false;
  }


  checkEmailFormat(i: number): boolean {
    if (i === 2) {
      const email = this.profileFields[i].value as string;
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      return emailRegex.test(email);
    }
    return false;
  }


  checkPhoneFormat(i: number): boolean {
    if (i === 3) {

      if (this.checkIfFieldIsEmpty(i)) {
        return true;
      }

      const phone = this.profileFields[i].value as string;
      const cleanedPhone = phone.replace(/[\s\-\(\)]+/g, '');//überprüfe, ob value buchstaben hat 
      const isValid = /^\d{7,15}$/.test(cleanedPhone);   // Überprüfe, ob die Länge zwischen 7 und 15 liegt und ob alle Zeichen Ziffern sind
      if (isValid || this.profileFields[i].value == '') {
        return true; 
      }
      return isValid;
    }
    
    return false;
  }


  isFormValid(): boolean {
    if (!this.enableBtn) {
      return false;  // Wenn `enableBtn` noch nicht aktiviert wurde, immer false zurückgeben
    }

    const allFieldsValid = this.checkAllFieldsValidthis();// prüfe, ob alle values den angaben entsprechen
    const noEditingInProgress = !this.checkIfInputsChecked(); // überpfrüfe ob alle felder getchekt sind
    const hasChangedValues = this.profileFields.some(field => field.value !== field.originalValue); //überprüfe, ob value geändert wurde
    if (hasChangedValues) {
      this.enableBtn = true;
    }
    
    return allFieldsValid && noEditingInProgress && hasChangedValues && this.enableBtn;
  }


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


  onSubmit(ngForm: NgForm) {
    if (ngForm.valid) {
      this.saveData();
      // guck dir die beschreibung mal an und behalt im hinterkopf. könnte nützlich sein
      // ngForm.form.markAsPristine();  //setzt den Zustand des Formulars oder eines Formularfeldes auf "pristine", was signalisiert, dass der Benutzer das Feld noch nicht berührt hat, unabhängig davon, ob er es tatsächlich getan hat.
      // ngForm.form.markAsUntouched(); // setzt den Zustand eines Formularfeldes oder des gesamten Formulars auf "untouched", was signalisiert, dass das Feld noch nie vom Benutzer fokussiert wurde.
    } else {
      console.log('Formular ist nicht korrekt ausgeführt');
    }
  }


  async saveData(){
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

      let done = await this.userService.updaterUserData(newUserData);
      if (done) {
        this.continueMessage = true;
      } else {
        this.continueMessage = false;
      }
    }
  }
}
