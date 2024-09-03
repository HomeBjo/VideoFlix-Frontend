import { CommonModule } from '@angular/common';
import { Component, Input, Output, EventEmitter  } from '@angular/core';
import Hls from 'hls.js';
import { VideoJson } from '../../../interfaces/video-json';
import { VideoService } from '../../../services/video-service.service';
import { FavoriteBody } from '../../../interfaces/favorite-body';
import { VideoSiteComponent } from '../video-site.component';


@Component({
  selector: 'app-video-display',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './video-display.component.html',
  styleUrl: './video-display.component.scss'
})
export class VideoDisplayComponent {
  @Input() video!: VideoJson;
  @Output() closeDisplay = new EventEmitter<VideoJson>();
  isVideoVisible = false;
  // closeOverlayPlayButton = false;
  private favoriteTimeout!: ReturnType<typeof setTimeout>;
  isFavorite: boolean = false;


  constructor(private videoService: VideoService, private videoSiteComponent: VideoSiteComponent) { }


  // ngOnInit(): void {
  //   this.isFavorite = this.video.is_favorite;
  //   console.log('isFavorite:',this.isFavorite);
    
  // }


  ngAfterViewInit(): void {
    // Initialisiere den Video.js-Player und das Plugin nach dem DOM-Laden
    if (Hls.isSupported()) {
      const videoElement = document.getElementById('videoPlayer') as HTMLVideoElement;
      const hls = new Hls();
      hls.loadSource(this.video.video_folder);
      hls.attachMedia(videoElement);
    } else if ((document.getElementById('videoPlayer') as HTMLVideoElement).canPlayType('application/vnd.apple.mpegurl')) {
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

  addFavorite(video: VideoJson) {
    video.is_favorite = !video.is_favorite;
  
    if (this.favoriteTimeout) { // reset timer
      clearTimeout(this.favoriteTimeout);
    }

    console.log(this.isFavorite, '-' ,video.is_favorite);
    // Wenn der Zustand geändert wurde (d.h., wenn `video.is_favorite` nicht mehr dem ursprünglichen Zustand entspricht)
    if (video.is_favorite != this.isFavorite) { // verbuggt
      const body: FavoriteBody = {
        fav_video: video.id
      };
  
      this.favoriteTimeout = setTimeout(() => { //  pushe das video nach 2 sek, wenn timer nicht resettet wird
        console.log('_____');
        this.videoService.addFavoriteVideo(body);
      }, 2000);
    }
  }
  

}