import { Component } from '@angular/core';
import { UserService } from '../../services/user-service.service';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { VideoPreviewComponent } from './video-preview/video-preview.component';
import { VideoService } from '../../services/video-service.service';
import { environment } from '../../../environments/environments';
import { VideoDisplayComponent } from "./video-display/video-display.component";
import { VideoJson } from '../../interfaces/video-json';

@Component({
  selector: 'app-video-site',
  standalone: true,
  imports: [FormsModule, CommonModule, VideoPreviewComponent, VideoDisplayComponent],
  templateUrl: './video-site.component.html',
  styleUrl: './video-site.component.scss'
})
export class VideoSiteComponent {
  newVideos: VideoJson[] = [];
  selectedVideo: any;
  private checkUserInterval: any;
  constructor(public userService: UserService, private route: Router, private videoService: VideoService) {}

  
  ngOnInit() {
    this.checkUserLoginStatus();
    this.videoService.startFetchVideos().subscribe((data: any) => {
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


  logout(){
    localStorage.setItem('logoutInProgress', 'true');
    let userID = localStorage.getItem('userId')?.toString();
    this.userService.userLogout(userID!);
  }

  ngOnDestroy() {
    if (this.checkUserInterval) {
      clearInterval(this.checkUserInterval);
    }
  }
  onVideoSelected(video: any) {
    this.selectedVideo = video;
  }

  closeVideoDisplay() {
    this.selectedVideo = null;
  }
 
}
