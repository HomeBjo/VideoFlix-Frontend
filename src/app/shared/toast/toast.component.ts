import { Component, Input } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-toast',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './toast.component.html',
  styleUrl: './toast.component.scss',
})
export class ToastComponent {
  @Input() message: string = '';
  @Input() type: 'success' | 'error' | 'info' = 'info';
  show: boolean = false;
  hide: boolean = false;

  showToast() {
    this.show = true;
    this.hide = false;

    setTimeout(() => {
      this.hide = true;

      setTimeout(() => {
        this.show = false;
      }, 500);
    }, 5000);
  }

  closeToast() {
    this.show = false;
  }
}
