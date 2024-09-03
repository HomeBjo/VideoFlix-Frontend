import { Injectable } from '@angular/core';
import { ToastComponent } from '../shared/toast/toast.component';


@Injectable({
  providedIn: 'root'
})
export class ToastServiceService {

  constructor() { }
  private toastComponent: ToastComponent | null = null;

  setToastComponent(toastComponent: ToastComponent) {
    this.toastComponent = toastComponent;
    console.log('ToastComponent gesetzt:', this.toastComponent);  // Debugging
  }

  showMessage(message: string, type: 'success' | 'error' | 'info') {
    if (this.toastComponent) {
      console.log('1111111Toast wird angezeigt');
      this.toastComponent.message = message;
      this.toastComponent.type = type;
      this.toastComponent.showToast();
    } else {
      console.error('ToastComponent ist nicht gesetzt');  // Fehler, wenn ToastComponent nicht gesetzt ist
    }
  }
}

