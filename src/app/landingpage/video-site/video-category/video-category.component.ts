import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component, ElementRef, HostListener, ViewChild } from '@angular/core';
import { UserService } from '../../../services/user-service.service';
import { VideoService } from '../../../services/video-service.service';
import { RouterLink, ActivatedRoute } from '@angular/router';
import { VideoJson } from '../../../interfaces/video-json';
import { VideoPreviewComponent } from '../video-preview/video-preview.component';
import { VideoDisplayComponent } from '../video-display/video-display.component';
import { switchMap } from 'rxjs/operators';
import { Subscription } from 'rxjs';


@Component({
  selector: 'app-video-category',
  standalone: true,
  imports: [
    CommonModule,
    RouterLink,
    VideoPreviewComponent,
    VideoDisplayComponent,
  ],
  templateUrl: './video-category.component.html',
  styleUrl: './video-category.component.scss',
})
export class VideoCategoryComponent {
  shwonProfilSelection: boolean = false;
  showCategorySelection: boolean = false;
  selectedVideo: VideoJson | null = null;
  categoryVideos: VideoJson[] = [];
  top5Videos: VideoJson[] = [];
  selectedCategory: string | null = null;
  private scrollDistance = 420;
  showArrows: boolean[] = [false, false, false, false, false];
  @ViewChild('video4LoopBox0') video4LoopBox0!: ElementRef<HTMLElement>;
  @ViewChild('video4LoopBox1') video4LoopBox1!: ElementRef<HTMLElement>;
  private favVideosSubscription: Subscription | null = null;

  constructor(
    public userService: UserService,
    public videoService: VideoService,
    private route: ActivatedRoute,
    private cdr: ChangeDetectorRef
  ) {}

    /**
   * Lifecycle hook that is called after the component is initialized.
   * Calls methods to load videos based on the selected category and loads the top 5 videos.
   * and fetches the user's favorite videos.
   */
    ngOnInit() {
      this.loadCategory();
      this.loadTop5();
      this.fetchFavVideos();
    }

    /**
   * Fetches the favorite videos by subscribing to the `reloadFavs$` observable.
   * The favorite videos are then updated in the video service.
   * 
   * This method listens for any triggers on `reloadFavs$`, makes an API call to
   * fetch the favorite videos, and updates the `favVideos` property in the video service.
   * 
   * In case of an error during fetching, it logs the error to the console.
   */
    fetchFavVideos() {
      this.favVideosSubscription = this.videoService.reloadFavs$
        .pipe(switchMap(() => this.videoService.fetchFavorites()))
        .subscribe(
          (data: VideoJson[]) => {
            this.videoService.favVideos = data;
          },
          (error: VideoJson[]) => {
            console.error('Error fetching fav videos:', error);
          }
        );
      this.videoService.reloadFavs$.next();
    }
  
    /**
   * Loads videos based on the selected category from the route parameters.
   * Subscribes to the `paramMap` to get the current category and fetches the corresponding videos.
   */
    loadCategory() {
    this.route.paramMap.subscribe((params) => {
      const category = params.get('category');
      if (category) {
        this.videoService.loadCategoryVideos(category).subscribe(
          (data: VideoJson[]) => {
            this.categoryVideos = data;
            this.selectedCategory = this.firstLetterBig(category);
          },
          (error: VideoJson[]) => {
            console.error('Error fetching videos:', error);
          }
        );
      }
    });
  }

    /**
   * Loads the top 5 videos.
   * Subscribes to the `loadTop5Videos` method from `VideoService` and assigns the data to `top5Videos`.
   */
  loadTop5(){
    this.videoService.loadTop5Videos().subscribe(
       (data: VideoJson[]) => {
        this.top5Videos = data;
      },
      (error: VideoJson[]) => {
        console.error('Error fetching videos:', error);
      }
    )
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
   * Toggles the visibility of the profile selection menu.
   */
  openSmallMenu() {
    this.shwonProfilSelection = !this.shwonProfilSelection;
  }

    /**
   * Toggles the visibility of the category selection menu.
   * @param {MouseEvent} event - The mouse event that triggers the toggle.
   */
  toggleCategoryMenu(event: MouseEvent) {
    event.stopPropagation();
    this.showCategorySelection = !this.showCategorySelection;
  }

   /**
   * Hides the category selection menu when clicking outside of it.
   * @param {MouseEvent} event - The click event used to check where the user clicked.
   */
  @HostListener('document:click', ['$event'])
  onClick(event: MouseEvent) {
    this.showCategorySelection = false;
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
   * Capitalizes the first letter of a given string.
   * 
   * @param {string} string - The string to capitalize.
   * @returns {string} - The string with the first letter capitalized.
   */
  firstLetterBig(string: string): string {
    return string.charAt(0).toUpperCase() + string.slice(1);
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
    ];

    videoLoopBoxes.forEach((box, index) => {
      const videoLoopBox = box?.nativeElement;
      this.showArrows[index] =
        videoLoopBox && videoLoopBox.scrollWidth > videoLoopBox.clientWidth;
    });
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
      default:
        console.error('Invalid index on left arrow:', index);
    }
  }

  ngOnDestroy() {
    if (this.favVideosSubscription) {
      this.favVideosSubscription.unsubscribe();
    }
  }
}
