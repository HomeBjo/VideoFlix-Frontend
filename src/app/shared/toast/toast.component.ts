import { Component,Input  } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-toast',
  standalone: true,
  imports: [FormsModule,CommonModule],
  templateUrl: './toast.component.html',
  styleUrl: './toast.component.scss'
})
export class ToastComponent {
  @Input() message: string = '';
  @Input() type: 'success' | 'error' | 'info' = 'info'; // Typen können angepasst werden
  show: boolean = false;
  hide: boolean = false;

  showToast() {
    this.show = true;  // zur sicherheit booleans setzen !
    this.hide = false; 
  
    // Starte die SlideOut nach 5 sek
    setTimeout(() => {
      this.hide = true;
  
      // Entferne show klasse nach der animation
      setTimeout(() => {
        this.show = false;
      }, 500); //  Verzögerung für slideout
    }, 5000); // zeit wan slideout benutzt wird
  }

  // showToast() {
  //   console.log('Toast wird angezeigt'); 
  //   this.show = true;
  // zum css stylen 
  // }

  closeToast() {
    this.show = false;
  }
}
