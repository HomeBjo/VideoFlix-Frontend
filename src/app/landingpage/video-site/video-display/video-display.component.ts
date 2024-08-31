import { CommonModule } from '@angular/common';
import { Component, Input, Output, EventEmitter  } from '@angular/core';
import Hls from 'hls.js';
import videojs from 'video.js';
import 'videojs-hls-quality-selector'; // Importiere das Plugin
// import HlsQualitySelector2 from 'videojs-hls-quality-selector';
import { VideoJson } from '../../../interfaces/video-json';
import { VideoService } from '../../../services/video-service.service';
import { FavoriteBody } from '../../../interfaces/favorite-body';
import { VideoSiteComponent } from '../video-site.component';
// import hlsQualitySelector from 'videojs-hls-quality-selector';

//initialisiere hlsQualitySelector extra
// videojs.registerPlugin('hlsQualitySelector', hlsQualitySelector);


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
  isFavorite: boolean = false;


  constructor(private videoService: VideoService, private videoSiteComponent: VideoSiteComponent) { }


  async ngOnInit(): Promise<void> {
    if(this.video.is_favorite){
      this.isFavorite = true;
    }
  }


  ngAfterViewInit(): void {
    // Initialisiere den Video.js-Player und das Plugin nach dem DOM-Laden
    if (Hls.isSupported()) {
      const videoElement = document.getElementById('videoPlayer') as HTMLVideoElement;
      const hls = new Hls();
      hls.loadSource(this.video.video_folder);
      hls.attachMedia(videoElement);
    // const player = videojs(videoElement); // aufrug der qualitatsauswahl - extension

    // Warte, bis der Player bereit ist, bevor das Plugin hinzugefügt wird
    // player.ready(() => {
    //   // Füge das Plugin hinzu
    //   new (player as any).hlsQualitySelector({
    //     displayCurrentQuality: true
    //   });
    // });

    // //  aufrug der qualitatsauswahl - extension mit mehr logs
    // const player = videojs(videoElement);
    // console.log('HLS Quality Selector Plugin loaded:', typeof videojs.getPlugin('hlsQualitySelector') === 'function');
    // player.ready(() => {
    //   console.log('Player:', player);
    //   console.log('Player methods:', Object.keys(player));
      
    //   if (typeof (player as any).hlsQualitySelector === 'function') {
    //     try {
    //       new (player as any).hlsQualitySelector({
    //         displayCurrentQuality: true
    //       });
    //     } catch (error) {
    //       console.error('Error initializing hlsQualitySelector:', error);
    //     }
    //   } else {
    //     console.error('hlsQualitySelector plugin is not available.');
    //   }
    // });    
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

  // addFavorite(id: number){
  //   this.isFavorite = !this.isFavorite;
  //   const body: FavoriteBody = { fav_video : id };
  //   console.log('favorite video-id: ',body);
    
  //   this.videoService.addFavoriteVideo(body);
  // }

  addFavorite(id: number) {
    this.isFavorite = !this.isFavorite;
    const body: FavoriteBody = { fav_video: id };

    this.videoService.addFavoriteVideo(body).then(() => {
      if (this.isFavorite) {
        this.videoSiteComponent.addFavoriteToComponent(this.video);  // Hinzufügen zu Favoriten
      } else {
        this.videoSiteComponent.removeFavoriteFromComponent(this.video);  // Entfernen von Favoriten
      }
    });
  }

}