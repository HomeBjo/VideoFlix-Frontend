import { Injectable } from '@angular/core';
import { ToastComponent } from '../shared/toast/toast.component';

@Injectable({
  providedIn: 'root',
})
export class ToastServiceService {
  constructor() {}
  private toastComponent: ToastComponent | null = null;

  setToastComponent(toastComponent: ToastComponent) {
    this.toastComponent = toastComponent;
  }

  showMessage(message: string, type: 'success' | 'error' | 'info') {
    if (this.toastComponent) {
      this.toastComponent.message = message;
      this.toastComponent.type = type;
      this.toastComponent.showToast();
    } else {
      console.error('ToastComponent ist nicht gesetzt'); 
    }
  }
}
