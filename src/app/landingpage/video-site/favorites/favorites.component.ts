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

  ngOnInit(){
    this.videoService.fetshFavorites();
  }

  onVideoSelected(video: VideoJson) {
    this.selectedVideo = video;
  }

  
  closeVideoDisplay() {
    this.selectedVideo = null;
  }
}
