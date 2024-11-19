import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { VideoJson } from '../../../interfaces/video-json';

@Component({
  selector: 'app-video-preview',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './video-preview.component.html',
  styleUrl: './video-preview.component.scss'
})
export class VideoPreviewComponent {
  @Input() video!: VideoJson;
  @Output() videoSelected = new EventEmitter<VideoJson>();
  isDescriptionVisible: true | false | null = null;

  /**
   * Toggles the visibility of the video description.
   */
  shwowDescription(){
    this.isDescriptionVisible = !this.isDescriptionVisible;
  }

  /**
   * Hides the video description.
   */
  hideDescription(){
    this.isDescriptionVisible = !this.isDescriptionVisible;
  }
  
    /**
   * Emits an event to show more details about the selected video.
   */
  showVideoDetails() {
    this.videoSelected.emit(this.video);
  }
}
