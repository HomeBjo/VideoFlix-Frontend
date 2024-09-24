import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { VideoService } from '../../../services/video-service.service';
import { VideoPreviewComponent } from '../video-preview/video-preview.component';
import { VideoDisplayComponent } from '../video-display/video-display.component';
import { VideoJson } from '../../../interfaces/video-json';


@Component({
  selector: 'app-favorites',
  standalone: true,
  imports: [FormsModule, CommonModule, VideoPreviewComponent, VideoDisplayComponent],
  templateUrl: './favorites.component.html',
  styleUrl: './favorites.component.scss'
})
export class FavoritesComponent {

  selectedVideo: VideoJson | null = null;

  constructor(public videoService: VideoService) { }

    /**
   * Lifecycle hook that is called after the component is initialized.
   * Fetches the user's favorite videos to display them on the favorites page.
   */
  ngOnInit(){
    this.videoService.fetchFavForFavoriteSite();
  }

    /**
   * Sets the selected video for display in the video preview component.
   * 
   * @param {VideoJson} video - The selected video.
   */
  onVideoSelected(video: VideoJson) {
    this.selectedVideo = video;
  }

    /**
   * Closes the video display and deselects the video.
   */
  closeVideoDisplay() {
    this.selectedVideo = null;
  }
}
