import { Injectable } from '@angular/core';
import { ToastComponent } from '../shared/toast/toast.component';

@Injectable({
  providedIn: 'root',
})
export class ToastServiceService {
  constructor() {}
  private toastComponent: ToastComponent | null = null;

    /**
   * Sets the ToastComponent instance to be used by the service.
   * @param {ToastComponent} toastComponent - The ToastComponent instance to be set.
   */
  setToastComponent(toastComponent: ToastComponent) {
    this.toastComponent = toastComponent;
  }

    /**
   * Displays a message on the toast with the specified type (success, error, or info).
   * If the ToastComponent is not set, logs an error.
   * 
   * @param {string} message - The message to display in the toast.
   * @param {'success' | 'error' | 'info'} type - The type of the toast (success, error, or info).
   */
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
