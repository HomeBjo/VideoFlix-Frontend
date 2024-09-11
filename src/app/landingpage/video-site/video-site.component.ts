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
import { switchMap } from 'rxjs/operators';

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
  @ViewChild('video4LoopBox0') video4LoopBox0!: ElementRef<HTMLElement>;
  @ViewChild('video4LoopBox1') video4LoopBox1!: ElementRef<HTMLElement>;
  @ViewChild('video4LoopBox2') video4LoopBox2!: ElementRef<HTMLElement>;
  @ViewChild('video4LoopBox3') video4LoopBox3!: ElementRef<HTMLElement>;
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

    /**
   * Lifecycle hook that is called after the component is initialized.
   * It checks the user's login status, fetches user data, and loads videos.
   */
  ngOnInit() {
    this.checkUserLoginStatus();
    this.userService.getUserData();
    this.fetshAllVideos();
    this.fetshFavVideos();
  }

    /**
   * Fetches all videos and assigns them to the `newVideos` array.
   */
  fetshAllVideos() {
    this.videoService.startFetchVideos().subscribe(
      (data: any) => {
        this.newVideos = data;
        this.videoService.allVideos = this.newVideos;
      },
      (error: any) => {
        console.error('Error fetching videos:', error);
      }
    );
  }

    /**
   * Fetches the user's favorite videos and updates the `favVideos` array in the `VideoService`.
   */
  fetshFavVideos() {
    this.videoService.reloadFavs$
      .pipe(switchMap(() => this.videoService.fetshFavorites()))
      .subscribe(
        (data: any) => {
          this.videoService.favVideos = data;
        },
        (error: any) => {
          console.error('Error fetching fav videos:', error);
        }
      );
    this.videoService.reloadFavs$.next();
  }

    /**
   * Lifecycle hook called after the view has been checked for updates.
   * Updates the visibility of scroll arrows based on video box widths.
   */
  ngAfterViewChecked() {
    this.updateArrowVisibility();
    this.cdr.detectChanges();
  }

    /**
   * Updates the visibility of scroll arrows based on the scroll width and client width of each video box.
   */
  updateArrowVisibility() {
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

    /**
   * Periodically checks the user's login status and redirects to the login page if the user is not logged in.
   */
  checkUserLoginStatus() {
    this.userService.checkUserInterval = setInterval(() => {
      let user_id = localStorage.getItem('userId')?.toString();
      if (!user_id) {
        this.route.navigateByUrl('/login');
      }
    }, 500);
  }

    /**
   * Logs the user out by calling the `userLogout` method from `UserService`.
   */
  logout() {
    localStorage.setItem('logoutInProgress', 'true');
    let userID = localStorage.getItem('userId')?.toString();
    this.userService.userLogout(userID!);
  }

    /**
   * Plays the selected video and requests fullscreen mode.
   * 
   * @param {string} videoPath - The path to the video file.
   */
  playVideo(videoPath: string) {
    if (
      this.myVideo &&
      this.myVideo.nativeElement instanceof HTMLVideoElement
    ) {
      const videoElement = this.myVideo.nativeElement;
      videoElement.src = videoPath; 
      videoElement.play();

      if (videoElement.requestFullscreen) {
       
        videoElement.requestFullscreen();
      } else if ((videoElement as any).webkitRequestFullscreen) {
        (videoElement as any).webkitRequestFullscreen(); 
      } else if ((videoElement as any).msRequestFullscreen) {
        (videoElement as any).msRequestFullscreen(); 
      }

      videoElement.muted = false; 
    } else {
      console.error('Video element not found');
    }
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

    /**
   * Toggles the visibility of the profile selection menu.
   */
  openSmallMenu() {
    this.shwonProfilSelection = !this.shwonProfilSelection;
  }

    /**
   * Scrolls the video loop box to the right based on the provided index.
   * 
   * @param {number} index - The index of the video box to scroll.
   */
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

    /**
   * Scrolls the video loop box to the left based on the provided index.
   * 
   * @param {number} index - The index of the video box to scroll.
   */
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

    /**
   * Checks if there are any videos marked as favorites.
   * 
   * @returns {boolean} - Returns true if there are favorite videos.
   */
  checkIfFavoreitesAvailable() {
    return this.videoService.favVideos.some((v) => v.is_favorite === true);
  }

    /**
   * Returns an array of videos that are marked as favorites.
   * 
   * @returns {VideoJson[]} - The list of favorite videos.
   */
  getFavorites() {
    return this.videoService.favVideos.filter((v) => v.is_favorite === true);
  }
}
