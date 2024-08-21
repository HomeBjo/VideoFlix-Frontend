import { Component, Input, Output, EventEmitter  } from '@angular/core';
import Hls from 'hls.js';

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

  ngAfterViewInit(): void {
    if (Hls.isSupported()) {
        const videoElement = document.getElementById('videoPlayer') as HTMLVideoElement;
        const hls = new Hls();
        hls.loadSource(this.video.video_folder); // werte aus unseren pfad 
        // hls.loadSource('http://127.0.0.1:8000/media/videos/city/city_480p.m3u8');
        hls.attachMedia(videoElement);

    } else if ((document.getElementById('videoPlayer') as HTMLVideoElement).canPlayType('application/vnd.apple.mpegurl')) {
        // von gpt ein fallback falls was nicht klappt 
        const videoElement = document.getElementById('videoPlayer') as HTMLVideoElement;
        videoElement.src = this.video.video_folder;
    }
}
  close() {
    this.closeDisplay.emit();
  }
  onOverlayClick(event: MouseEvent) {
    this.close();
  }
}