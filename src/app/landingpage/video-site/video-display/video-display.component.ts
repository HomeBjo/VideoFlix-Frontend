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


    /**
   * Lifecycle hook that is called after the view is initialized.
   * Sets up the video player and event listeners.
   */
  ngAfterViewInit(): void {
    this.videoElement = document.getElementById('videoPlayer') as HTMLVideoElement;
    this.loadVideo('auto');

    this.videoElement.addEventListener('play', this.onPlayPause.bind(this));
    this.videoElement.addEventListener('pause', this.onPlayPause.bind(this));
    this.videoElement.addEventListener('ended', this.onVideoEnded.bind(this));

    document.addEventListener('fullscreenchange', this.onFullScreenChange.bind(this));
  }

  /**
   * Loads the video with the specified quality.
   * @param {string} quality - The selected video quality (Auto, 480p, 720p, 1080p).
   */
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
  
  /**
   * Sets the appropriate video source URL based on the selected quality.
   * @param {string} quality - The quality to load (e.g., '480p', '720p', '1080p', 'Auto').
   */
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

  /**
   * Changes the video quality and reloads the video.
   * @param {string} quality - The quality to switch to.
   */
  onQualityChange(quality: string): void {
    if (this.videoElement && !this.videoElement.paused) {
      this.videoElement.pause();
    }
    this.loadVideo(quality);
    this.hideDropdown();
  }

  /**
   * Hides the quality selection dropdown.
   */
  hideDropdown(): void {
    this.dropdownOpen = false;
  }

  /**
   * Toggles the visibility of the quality selection dropdown.
   */
  toggleDropdown(): void {
    if (this.videoElement && !this.videoElement.paused) {
      this.videoElement.pause();
    }
    this.dropdownOpen = !this.dropdownOpen;
  }

  /**
   * Closes the video display and emits the close event.
   */
  close() {
    this.closeDisplay.emit();
  }

  /**
   * Handles clicks on the overlay and closes the video display.
   * @param {MouseEvent} event - The click event that triggers the method.
   */
  onOverlayClick(event: MouseEvent) {
    this.close();
  }

  /**
   * Shows the video by setting `isVideoVisible` to true.
   */
  showVideo(): void {
    this.isVideoVisible = true;
  }

  /**
   * Closes the video by setting `isVideoVisible` to false.
   */
  close2(): void {
    this.isVideoVisible = false;
  }

  /**
   * Checks if the current video is marked as a favorite.
   * @returns {boolean} - Returns true if the video is a favorite.
   */
  checkIfFavorite(): boolean {
    return this.videoService.favVideos.some(favVideo => favVideo.id === this.video.id);
  }

  /**
   * Adds or removes the video from the user's favorites.
   * @param {VideoJson} video - The video to add or remove from favorites.
   */
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
        await this.videoService.addFavoriteVideo(body);
        this.videoService.reloadFavs$.next();
      } catch (e) {
        console.log('Fehler beim Favorisieren:', e);
      } finally {
        this.isRequestInProgress = false;
      }
    }, 300);
  }

   /**
   * Displays the quality selector for the video.
   */
  showQualitySelector(): void {
    this.showQualitySelectorBool = true;
  }


  /**
   * Handles mouse movement events and shows the quality selector when the mouse is moved.
   * Triggers the `onPlayPause` method if the quality selector is visible.
   */
  checkMouseMove(): void {
    this.showQualitySelectorBool = true;
    if (this.showQualitySelectorBool) {
      this.onPlayPause();
    }
  }

    /**
   * Resets the control bar timer and hides the control bar after 3 seconds of inactivity.
   */
  resetControlBarTimer(): void {
    if (this.controlBarTimer) {
      clearTimeout(this.controlBarTimer);
    }
    this.controlBarTimer = setTimeout(() => {
      this.isControlBarVisible = false;
    }, 3000); 
  }

  /**
   * Hides the quality selector and closes the dropdown if the video is not paused.
   */
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

    /**
   * Starts a timer to hide the quality selector after 2.6 seconds of inactivity.
   */
  startInactivityTimer(): void {
    if (this.inactivityTimer) {
      clearTimeout(this.inactivityTimer);
    }
    this.inactivityTimer = setTimeout(() => {
      this.hideQualitySelector();
    }, 2600);
  }

  /**
   * Resets the inactivity timer to prevent the quality selector from hiding.
   */
  resetTimer(): void {
    if (this.inactivityTimer) {
      clearTimeout(this.inactivityTimer);
    }
  }

  /**
   * Handles play/pause events and shows/hides UI controls accordingly.
   */
  onPlayPause(): void {
    if (this.videoElement.paused) {
      this.showQualitySelectorBool = true; 
      this.isControlBarVisible = true;
    } else {
      this.startFadeOut();
    }
  }

  /**
   * Starts a timer to fade out the quality selector after a period of inactivity.
   */
  startFadeOut(): void {
    if (this.fadeOutTimeout) {
      clearTimeout(this.fadeOutTimeout);
    }
    this.fadeOutTimeout = setTimeout(() => {
      this.showQualitySelectorBool = false;
    }, 2600);
  }

  /**
   * Handles the event when the video ends, showing the control bar and quality selector.
   */
  onVideoEnded(): void {
    this.showQualitySelectorBool = true;
  }

  /**
   * Handles changes in fullscreen mode and adjusts the visibility of the quality selector.
   */
  onFullScreenChange(): void { 
    if (document.fullscreenElement) {
      this.showQualitySelectorBool = true; // Qualitätsschalter im Vollbildmodus anzeigen
    } else {
      this.showQualitySelectorBool = false; // Qualitätsschalter im normalen Modus ausblenden
    }
    this.cdr.detectChanges();
  }

  /**
   * Cleanup method to remove event listeners and clear timers when the component is destroyed.
   */
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
