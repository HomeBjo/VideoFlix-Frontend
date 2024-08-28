import { Component, ElementRef, ViewChild } from '@angular/core';
import { UserService } from '../../services/user-service.service';
import { Router, RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { VideoPreviewComponent } from './video-preview/video-preview.component';
import { VideoService } from '../../services/video-service.service';
import { VideoDisplayComponent } from "./video-display/video-display.component";
import { VideoJson } from '../../interfaces/video-json';
import { HeaderComponent } from "../../shared/videoSite/header/header.component";

@Component({
  selector: 'app-video-site',
  standalone: true,
  imports: [FormsModule, CommonModule, VideoPreviewComponent, VideoDisplayComponent, RouterLink, HeaderComponent],
  templateUrl: './video-site.component.html',
  styleUrl: './video-site.component.scss'
})
export class VideoSiteComponent {
  newVideos: VideoJson[] = [];
  shwonProfilSelection:boolean = false;
  selectedVideo: any;
  private checkUserInterval: any;
  @ViewChild('video4LoopBox1') video4LoopBox1!: ElementRef<HTMLElement>;
  @ViewChild('video4LoopBox2') video4LoopBox2!: ElementRef<HTMLElement>;
  @ViewChild('video4LoopBox3') video4LoopBox3!: ElementRef<HTMLElement>;
  @ViewChild('video4LoopBox4') video4LoopBox4!: ElementRef<HTMLElement>;
  private scrollDistance = 420;
  constructor(public userService: UserService, private route: Router, private videoService: VideoService) {}

  
  ngOnInit() {
    this.checkUserLoginStatus();
    this.videoService.startFetchVideos().subscribe((data: any) => {
      this.newVideos = data;
      console.log(this.newVideos);
      this.userService.getUserData();
    }, (error: any) => {
      console.error('Error fetching videos:', error);
    }); 
  }

  ngAfterViewInit() { // check, ob das element mit der id vorhanden ist bach dem laden
    if (this.video4LoopBox1) {
      console.log('video4LoopBox:', this.video4LoopBox1);
    } else {
      console.warn('video4LoopBox element not found');
    }
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


  openSmallMenu(){
    this.shwonProfilSelection = !this.shwonProfilSelection;
  }
 
  ArrowRightClick(index: number) {
    switch (index) {
      case 1:
        this.video4LoopBox1!.nativeElement.scrollLeft += this.scrollDistance;
        break;
      case 2:
        this.video4LoopBox2!.nativeElement.scrollLeft += this.scrollDistance;
        break;
      case 3:
        this.video4LoopBox3!.nativeElement.scrollLeft += this.scrollDistance;
        break;
      case 4:
        this.video4LoopBox4!.nativeElement.scrollLeft += this.scrollDistance;
        break;
      default:
        console.error('Invalid index on rigth arrow:', index);
    }
  }

  ArrowLeftClick(index: number) {
    switch (index) {
      case 1:
        this.video4LoopBox1!.nativeElement.scrollLeft -= this.scrollDistance;
        break;
      case 2:
        this.video4LoopBox2!.nativeElement.scrollLeft -= this.scrollDistance;
        break;
      case 3:
        this.video4LoopBox3!.nativeElement.scrollLeft -= this.scrollDistance;
        break;
      case 4:
        this.video4LoopBox4!.nativeElement.scrollLeft -= this.scrollDistance;
        break;
      default:
        console.error('Invalid index on left arrow:', index);
    }
  }
}
