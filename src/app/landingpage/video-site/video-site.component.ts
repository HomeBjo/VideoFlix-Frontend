import {
  ChangeDetectorRef,
  Component,
  ElementRef,
  ViewChild,
} from '@angular/core';
import { UserService } from '../../services/user-service.service';
import { Router, RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { VideoPreviewComponent } from './video-preview/video-preview.component';
import { VideoService } from '../../services/video-service.service';
import { VideoDisplayComponent } from './video-display/video-display.component';
import { VideoJson } from '../../interfaces/video-json';
import { HeaderComponent } from '../../shared/videoSite/header/header.component';

@Component({
  selector: 'app-video-site',
  standalone: true,
  imports: [
    FormsModule,
    CommonModule,
    VideoPreviewComponent,
    VideoDisplayComponent,
    RouterLink,
    HeaderComponent,
  ],
  templateUrl: './video-site.component.html',
  styleUrl: './video-site.component.scss',
})
export class VideoSiteComponent {
  newVideos: VideoJson[] = [];
  shwonProfilSelection: boolean = false;
  selectedVideo: VideoJson | null = null;
  private checkUserInterval: any;
  @ViewChild('video4LoopBox0') video4LoopBox0!: ElementRef<HTMLElement>;
  @ViewChild('video4LoopBox1') video4LoopBox1!: ElementRef<HTMLElement>;
  @ViewChild('video4LoopBox2') video4LoopBox2!: ElementRef<HTMLElement>;
  @ViewChild('video4LoopBox3') video4LoopBox3!: ElementRef<HTMLElement>;
  // @ViewChild('video4LoopBox4') video4LoopBox4!: ElementRef<HTMLElement>;
  @ViewChild('myVideo') myVideo!: ElementRef<HTMLVideoElement>;
  private scrollDistance = 420;
  showArrows: boolean[] = [false, false, false, false, false];
  showFavDiv: true | false | null = null;

  constructor(
    private cdr: ChangeDetectorRef,
    public userService: UserService,
    private route: Router,
    public videoService: VideoService
  ) {}


  ngOnInit() {
    this.checkUserLoginStatus();
    this.fetshFavVideos();
    this.fetshAllVideos();
  }

  fetshAllVideos(){
    this.videoService.startFetchVideos().subscribe(
      (data: any) => {
        this.newVideos = data;
        console.log(this.newVideos);
        this.videoService.allVideos = this.newVideos;
        this.userService.getUserData();
      },
      (error: any) => {
        console.error('Error fetching videos:', error);
      }
    );
  }

  fetshFavVideos(){
    this.videoService.fetshFavorites().subscribe(
      (data: any) => {
        this.videoService.favVideos = data;
        console.log(this.videoService.favVideos);
      },
      (error: any) => {
        console.error('Error fetching fav videos:', error);
      }
    );
  }


  ngAfterViewChecked() {
    //angularproblem- überprüfung der werte nach dem laden
    this.updateArrowVisibility();
    this.cdr.detectChanges();
  }


  updateArrowVisibility() {
    //angularproblem- überprüfung der werte nach dem laden
    const videoLoopBoxes = [
      this.video4LoopBox0,
      this.video4LoopBox1,
      this.video4LoopBox2,
      this.video4LoopBox3,
    ];

    videoLoopBoxes.forEach((box, index) => {
      const videoLoopBox = box?.nativeElement;
      this.showArrows[index] =
        videoLoopBox && videoLoopBox.scrollWidth > videoLoopBox.clientWidth;
    });
  }


  checkUserLoginStatus() {
    this.checkUserInterval = setInterval(() => {
      let user_id = localStorage.getItem('userId')?.toString();
      if (!user_id) {
        this.route.navigateByUrl('/login');
      }
    }, 500);
  }


  logout() {
    localStorage.setItem('logoutInProgress', 'true');
    let userID = localStorage.getItem('userId')?.toString();
    this.userService.userLogout(userID!);
  }


  playVideo(videoPath: string) {

    if (this.myVideo && this.myVideo.nativeElement instanceof HTMLVideoElement) {
      const videoElement = this.myVideo.nativeElement;
      videoElement.src = videoPath; // deklariere den path des videos an
      videoElement.play(); // spiele das Video ab

      if (videoElement.requestFullscreen) { // Fordere den Vollbildmodus an
        videoElement.requestFullscreen();
      } else if ((videoElement as any).webkitRequestFullscreen) {
        (videoElement as any).webkitRequestFullscreen(); // Safari Unterstützung
      } else if ((videoElement as any).msRequestFullscreen) {        
        (videoElement as any).msRequestFullscreen();// IE/Edge Unterstützung
      }

      videoElement.muted = false; // optional: den ton aktivieren
    } else {
      console.error('Video element not found');
    }
  }


  onVideoSelected(video: VideoJson) {
    this.selectedVideo = video;
  }


  closeVideoDisplay() {
    this.selectedVideo = null;
  }


  openSmallMenu() {
    this.shwonProfilSelection = !this.shwonProfilSelection;
  }


  ArrowRightClick(index: number) {
    switch (index) {
      case 0:
        this.video4LoopBox0!.nativeElement.scrollLeft += this.scrollDistance;
        break;
      case 1:
        this.video4LoopBox1!.nativeElement.scrollLeft += this.scrollDistance;
        break;
      case 2:
        this.video4LoopBox2!.nativeElement.scrollLeft += this.scrollDistance;
        break;
      case 3:
        this.video4LoopBox3!.nativeElement.scrollLeft += this.scrollDistance;
        break;
      default:
        console.error('Invalid index on rigth arrow:', index);
    }
  }


  ArrowLeftClick(index: number) {
    switch (index) {
      case 0:
        this.video4LoopBox0!.nativeElement.scrollLeft -= this.scrollDistance;
        break;
      case 1:
        this.video4LoopBox1!.nativeElement.scrollLeft -= this.scrollDistance;
        break;
      case 2:
        this.video4LoopBox2!.nativeElement.scrollLeft -= this.scrollDistance;
        break;
      case 3:
        this.video4LoopBox3!.nativeElement.scrollLeft -= this.scrollDistance;
        break;
      default:
        console.error('Invalid index on left arrow:', index);
    }
  }


  checkIfFavoreitesAvailable() {
    return this.videoService.favVideos.some(v => v.is_favorite === true);
  }


  getFavorites(){
    return this.videoService.favVideos.filter(v => v.is_favorite === true);
  }

}
