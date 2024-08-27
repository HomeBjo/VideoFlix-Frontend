import { CommonModule } from '@angular/common';
import { Component, Input, Output, EventEmitter  } from '@angular/core';
import Hls from 'hls.js';
import { VideoJson } from '../../../interfaces/video-json';
import { VideoService } from '../../../services/video-service.service';
import { FavoriteBody } from '../../../interfaces/favorite-body';

@Component({
  selector: 'app-video-display',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './video-display.component.html',
  styleUrl: './video-display.component.scss'
})
export class VideoDisplayComponent {
  @Input() video!: VideoJson;
  @Output() closeDisplay = new EventEmitter<void>();
  isVideoVisible = false;
  // closeOverlayPlayButton = false;
  isFavorite: boolean = false;


  constructor(private videoService: VideoService) { }


  async ngOnInit(): Promise<void> {
    if(this.video.is_favorite){
      this.isFavorite = true;
    }
  }


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

  showVideo(): void {
    // this.closeOverlayPlayButton = true;
    this.isVideoVisible = true;
  }

  close2(): void {
    // Deine Logik zum Schließen des Video-Overlays
    this.isVideoVisible = false;
  }

  addFavorite(id: number){
    this.isFavorite = !this.isFavorite;
    const body: FavoriteBody = { fav_video : id };
    console.log('favorite video-id: ',body);
    
    this.videoService.addFavoriteVideo(body);
  }
}