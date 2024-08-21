import { Component, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-video-display',
  standalone: true,
  imports: [],
  templateUrl: './video-display.component.html',
  styleUrl: './video-display.component.scss'
})
export class VideoDisplayComponent {
  @Input() video: any;
  @Output() closeDisplay = new EventEmitter<void>();

  close() {
    this.closeDisplay.emit();
  }
}