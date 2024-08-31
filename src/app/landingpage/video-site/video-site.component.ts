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
  @ViewChild('video4LoopBox4') video4LoopBox4!: ElementRef<HTMLElement>;
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
    this.videoService.startFetchVideos().subscribe(
      (data: any) => {
        this.newVideos = data;
        // console.log(this.newVideos);
        this.videoService.allVideos = this.newVideos;
        this.userService.getUserData();
      },
      (error: any) => {
        console.error('Error fetching videos:', error);
      }
    );
    this.videoService.fetshFavorites().then(() => {
      this.updateShowFavDiv();
    });
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
      this.video4LoopBox4,
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
        console.log('No user ID found, redirecting to login...');
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
      case 4:
        this.video4LoopBox4!.nativeElement.scrollLeft += this.scrollDistance;
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
      case 4:
        this.video4LoopBox4!.nativeElement.scrollLeft -= this.scrollDistance;
        break;
      default:
        console.error('Invalid index on left arrow:', index);
    }
  }


  // überprüfe ob die breite der videoDiv breiter ist als der bildschim. wenn ja, dann zeig preile an
  checkShowArrow(index: number): boolean {
    if (index) {
      const videoLoopBoxes = [
        this.video4LoopBox1,
        this.video4LoopBox2,
        this.video4LoopBox3,
        this.video4LoopBox4,
      ];

      const videoLoopBox = videoLoopBoxes[index - 1]?.nativeElement;

      if (!videoLoopBox) {
        return false;
      }

      return videoLoopBox.scrollWidth > videoLoopBox.clientWidth;
    }
    return false;
  }


  checkIfFavoreitesAvailable() {
    return this.videoService.favVideos.length > 0;
  }


  updateShowFavDiv() {
    this.showFavDiv = this.videoService.favVideos.length > 0 ? true : false;
  }


  addFavoriteToComponent(video: VideoJson) {
    this.videoService.favVideos.push(video);
    console.log('Added video to favorites:', this.videoService.favVideos);

    this.updateShowFavDiv();
    this.cdr.detectChanges();
  }


  removeFavoriteFromComponent(video: VideoJson) {
    const index = this.videoService.favVideos.findIndex(
      (favVideo) => favVideo.id === video.id
    );
    if (index > -1) {
      this.videoService.favVideos.splice(index, 1);
      console.log('Removed video from favorites:', this.videoService.favVideos);

      this.updateShowFavDiv();
      this.cdr.detectChanges();
    }
  }


  ngOnDestroy() {
    if (this.checkUserInterval) {
      clearInterval(this.checkUserInterval);
    }
  }

}
