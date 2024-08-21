import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-video-preview',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './video-preview.component.html',
  styleUrl: './video-preview.component.scss'
})
export class VideoPreviewComponent {
  @Input() video: any = [];
  @Output() videoSelected = new EventEmitter<any>();
  isDescriptionVisible: boolean = false;


  shwowDescription(){
    this.isDescriptionVisible = !this.isDescriptionVisible;
  }

  hideDescription(){
    this.isDescriptionVisible = !this.isDescriptionVisible;
  }
  showVideoDetails() {
    this.videoSelected.emit(this.video);
  }
}
