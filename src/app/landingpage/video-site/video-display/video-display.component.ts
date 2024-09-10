import { CommonModule } from '@angular/common';
import {
  Component,
  Input,
  Output,
  EventEmitter,
  ChangeDetectorRef
} from '@angular/core';
import Hls from 'hls.js';
import { VideoJson } from '../../../interfaces/video-json';
import { VideoService } from '../../../services/video-service.service';
import { FavoriteBody } from '../../../interfaces/favorite-body';

@Component({
  selector: 'app-video-display',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './video-display.component.html',
  styleUrl: './video-display.component.scss',
})
export class VideoDisplayComponent {
  @Input() video!: VideoJson;
  @Output() closeDisplay = new EventEmitter<VideoJson>();
  isVideoVisible = false;
  private favoriteTimeout!: ReturnType<typeof setTimeout>;
  private inactivityTimer!: ReturnType<typeof setTimeout>;
  private fadeOutTimeout!: ReturnType<typeof setTimeout>;
  private hoverTimer!: ReturnType<typeof setTimeout>; 
  isRequestInProgress: boolean = false;
  selectedQualitySrc: string = '';
  hls!: Hls;
  dropdownOpen: boolean = false;
  hideQualitySelectorSlower: boolean = false;
  currentQuality: string = 'Auto';
  showQualitySelectorBool: boolean | null = null;
  isControlBarVisible: boolean = true; 
  private videoElement!: HTMLVideoElement;
  private controlBarTimer!: ReturnType<typeof setTimeout>;


  constructor(
    private videoService: VideoService,
    private cdr: ChangeDetectorRef
  ) {}

  // ngAfterViewInit(): void {
  //   // Initialisiere den Video.js-Player und das Plugin nach dem DOM-Laden
  //   if (Hls.isSupported()) {
  //     const videoElement = document.getElementById(
  //       'videoPlayer'
  //     ) as HTMLVideoElement;
  //     const hls = new Hls();
  //     hls.loadSource(this.video.video_folder);
  //     hls.attachMedia(videoElement);
  //   } else if (
  //     (document.getElementById('videoPlayer') as HTMLVideoElement).canPlayType(
  //       'application/vnd.apple.mpegurl'
  //     )
  //   ) {
  //     const videoElement = document.getElementById(
  //       'videoPlayer'
  //     ) as HTMLVideoElement;
  //     videoElement.src = this.video.video_folder;
  //   }
  // }
  ngAfterViewInit(): void {
    this.videoElement = document.getElementById('videoPlayer') as HTMLVideoElement;
    this.loadVideo('auto');

    this.videoElement.addEventListener('play', this.onPlayPause.bind(this));
    this.videoElement.addEventListener('pause', this.onPlayPause.bind(this));
    this.videoElement.addEventListener('ended', this.onVideoEnded.bind(this));

    document.addEventListener('fullscreenchange', this.onFullScreenChange.bind(this));
  }


  loadVideo(quality: string): void {
    if (Hls.isSupported()) {
      const videoElement = this.videoElement;
      this.checkQualityLevels(quality); 

      if (Hls.isSupported()) {
        this.hls = new Hls();
        this.hls.loadSource(this.selectedQualitySrc);
        this.hls.attachMedia(videoElement);
      } else if (videoElement.canPlayType('application/vnd.apple.mpegurl')) {
        videoElement.src = this.selectedQualitySrc;
      }

    }
  }
  

  checkQualityLevels(quality: string) {
    switch (quality) {
      case '480p':
        this.selectedQualitySrc = this.video.video_folder.replace('_master.m3u8', '_480p.m3u8');
        this.currentQuality = '480p';
        break;
      case '720p':
        this.selectedQualitySrc = this.video.video_folder.replace('_master.m3u8', '_720p.m3u8');
        this.currentQuality = '720p';
        break;
      case '1080p':
        this.selectedQualitySrc = this.video.video_folder.replace('_master.m3u8', '_1080p.m3u8');
        this.currentQuality = '1080p';
        break;
      default:
        this.selectedQualitySrc = this.video.video_folder;
        this.currentQuality = 'Auto'; 
    }
  }


  onQualityChange(quality: string): void {
    if (this.videoElement && !this.videoElement.paused) {
      this.videoElement.pause();
    }
    this.loadVideo(quality);
    this.hideDropdown();
  }


  hideDropdown(): void {
    this.dropdownOpen = false;
  }


  toggleDropdown(): void {
    if (this.videoElement && !this.videoElement.paused) {
      this.videoElement.pause();
    }
    this.dropdownOpen = !this.dropdownOpen;
  }


  close() {
    this.closeDisplay.emit();
  }


  onOverlayClick(event: MouseEvent) {
    this.close();
  }


  showVideo(): void {
    this.isVideoVisible = true;
  }


  close2(): void {
    this.isVideoVisible = false;
  }


  checkIfFavorite(): boolean {
    return this.videoService.favVideos.some(favVideo => favVideo.id === this.video.id);
  }


  async addFavorite(video: VideoJson) {
    if (this.isRequestInProgress) {
      return;
    }

    const body: FavoriteBody = {
      fav_video: video.id,
    };

    this.isRequestInProgress = true;
    this.favoriteTimeout = setTimeout(async () => {
      try {
        console.log('_____update fav');
        await this.videoService.addFavoriteVideo(body);
        this.videoService.reloadFavs$.next();
      } catch (e) {
        console.log('Fehler beim Favorisieren:', e);
      } finally {
        this.isRequestInProgress = false;
        this.videoService.reloadFavs$.next();
      }
    }, 300);
  }

  
  showQualitySelector(): void {
    this.showQualitySelectorBool = true;
  }


  // @HostListener('document:mousemove')
  checkMouseMove(): void {
    this.showQualitySelectorBool = true;
    if (this.showQualitySelectorBool) {
      this.onPlayPause();
    }
  }

  resetControlBarTimer(): void {
    if (this.controlBarTimer) {
      clearTimeout(this.controlBarTimer);
    }
    this.controlBarTimer = setTimeout(() => {
      this.isControlBarVisible = false;
    }, 3000); 
  }


  hideQualitySelector(): void {
    if (this.videoElement.paused) {
      return;
    }
    if (this.inactivityTimer) {
      clearTimeout(this.inactivityTimer);
    }
    this.dropdownOpen = false;
    this.showQualitySelectorBool = false;
  }

  
  startInactivityTimer(): void {
    if (this.inactivityTimer) {
      clearTimeout(this.inactivityTimer);
    }
    this.inactivityTimer = setTimeout(() => {
      this.hideQualitySelector();
    }, 2600);
  }


  resetTimer(): void {
    if (this.inactivityTimer) {
      clearTimeout(this.inactivityTimer);
    }
  }


  onPlayPause(): void {
    if (this.videoElement.paused) {
      this.showQualitySelectorBool = true; 
      this.isControlBarVisible = true;
    } else {
      this.startFadeOut();
    }
  }


  startFadeOut(): void {
    if (this.fadeOutTimeout) {
      clearTimeout(this.fadeOutTimeout);
    }
    this.fadeOutTimeout = setTimeout(() => {
      this.showQualitySelectorBool = false;
    }, 2600);
  }


  onVideoEnded(): void {
    this.showQualitySelectorBool = true;
  }


  onFullScreenChange(): void { 
    if (document.fullscreenElement) {
      this.showQualitySelectorBool = true; // Qualitätsschalter im Vollbildmodus anzeigen
    } else {
      this.showQualitySelectorBool = false; // Qualitätsschalter im normalen Modus ausblenden
    }
    this.cdr.detectChanges();
  }


  ngOnDestroy(): void {
    if (this.videoElement) {
      this.videoElement.removeEventListener('play', this.onPlayPause.bind(this));
      this.videoElement.removeEventListener('pause', this.onPlayPause.bind(this));
      this.videoElement.removeEventListener('ended', this.onVideoEnded.bind(this));
    }
    if (this.fadeOutTimeout) {
      clearTimeout(this.fadeOutTimeout);
    }
    document.removeEventListener('fullscreenchange', this.onFullScreenChange.bind(this));
  }

}
