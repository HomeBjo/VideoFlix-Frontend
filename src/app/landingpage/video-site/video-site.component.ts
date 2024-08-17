import { Component } from '@angular/core';
import { UserService } from '../../services/user-service.service';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { VideoPreviewComponent } from './video-preview/video-preview.component';
import { VideoService } from '../../services/video-service.service';
import { environment } from '../../../environments/environments';

@Component({
  selector: 'app-video-site',
  standalone: true,
  imports: [FormsModule, CommonModule, VideoPreviewComponent],
  templateUrl: './video-site.component.html',
  styleUrl: './video-site.component.scss'
})
export class VideoSiteComponent {
  newVideos: any[] = [];
  private checkUserInterval: any;
  constructor(public userService: UserService, private route: Router, private videoService: VideoService) {}

  
  async ngOnInit() {
    this.checkUserLoginStatus();
    (await this.videoService.startFetchVideos()).subscribe((data: any) => {
      data.map((video: any) => {
        video.screenshot = `${environment.baseUrl}${video.screenshot}`;
        video.video_folder = `${environment.baseUrl}${video.video_folder}`;
        return video;
      });
      this.newVideos = data;
      console.log(this.newVideos);
    }, (error: any) => {
      console.error('Error fetching videos:', error);
    });
  }


  checkUserLoginStatus(){
    this.checkUserInterval = setInterval(() => {
      let user_id = localStorage.getItem('userId')?.toString();
      if (!user_id) {
        console.log('No user ID found, redirecting to login...');
        this.route.navigateByUrl('/login');
      }
    }, 500);
  }


  ngOnDestroy() {
    if (this.checkUserInterval) {
      clearInterval(this.checkUserInterval);
    }
  }
 
}
