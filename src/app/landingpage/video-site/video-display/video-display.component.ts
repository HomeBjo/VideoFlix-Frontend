import { CommonModule } from '@angular/common';
import {
  Component,
  Input,
  Output,
  EventEmitter,
  ChangeDetectorRef,
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
  // closeOverlayPlayButton = false;
  private favoriteTimeout!: ReturnType<typeof setTimeout>;
  // isFavorite: boolean = false;
  isRequestInProgress: boolean = false;

  constructor(
    private videoService: VideoService,
    private cdr: ChangeDetectorRef
  ) {}

  ngAfterViewInit(): void {
    // Initialisiere den Video.js-Player und das Plugin nach dem DOM-Laden
    if (Hls.isSupported()) {
      const videoElement = document.getElementById(
        'videoPlayer'
      ) as HTMLVideoElement;
      const hls = new Hls();
      hls.loadSource(this.video.video_folder);
      hls.attachMedia(videoElement);
    } else if (
      (document.getElementById('videoPlayer') as HTMLVideoElement).canPlayType(
        'application/vnd.apple.mpegurl'
      )
    ) {
      const videoElement = document.getElementById(
        'videoPlayer'
      ) as HTMLVideoElement;
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
        this.videoService.reloadFavs$.next(); // aktualisiere die Favoritenliste
      } catch (e) {
        console.log('Fehler beim Favorisieren:', e);
        this.videoService.reloadFavs$.next(); // aktualisiere die Favoritenliste
      } finally {
        this.isRequestInProgress = false;
        this.videoService.reloadFavs$.next(); // aktualisiere die Favoritenliste
      }
    }, 300);
  }
}
