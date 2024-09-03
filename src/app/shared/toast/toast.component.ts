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

  // showToast() {
  //   console.log('Toast wird angezeigt'); 
  //   this.show = true;
  //   setTimeout(() => {
  //     this.show = false;
  //   }, 5000); // Blendet die Nachricht nach 5 Sekunden automatisch aus
  // }

  showToast() {
    console.log('Toast wird angezeigt'); 
    this.show = true;
    
     
     // Blendet die Nachricht nach 5 Sekunden automatisch aus
  }

  closeToast() {
    this.show = false;
  }
}
