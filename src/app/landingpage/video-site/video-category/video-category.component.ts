import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component, ElementRef, HostListener, ViewChild } from '@angular/core';
import { UserService } from '../../../services/user-service.service';
import { VideoService } from '../../../services/video-service.service';
import { RouterLink, ActivatedRoute } from '@angular/router';
import { VideoJson } from '../../../interfaces/video-json';
import { VideoPreviewComponent } from '../video-preview/video-preview.component';
import { VideoDisplayComponent } from '../video-display/video-display.component';

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
  selectedVideo: any;
  categoryVideos: VideoJson[] = [];
  selectedCategory: string | null = null;
  private scrollDistance = 420;
  showArrows: boolean[] = [false, false, false, false, false];
  @ViewChild('video4LoopBox0') video4LoopBox0!: ElementRef<HTMLElement>;
  @ViewChild('video4LoopBox1') video4LoopBox1!: ElementRef<HTMLElement>;
  @ViewChild('video4LoopBox2') video4LoopBox2!: ElementRef<HTMLElement>;
  @ViewChild('video4LoopBox3') video4LoopBox3!: ElementRef<HTMLElement>;

  constructor(
    public userService: UserService,
    public videoService: VideoService,
    private route: ActivatedRoute,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit() {
    this.route.paramMap.subscribe((params) => {
      const category = params.get('category');
      if (category) {
        this.videoService.loadCategoryVideos(category).subscribe(
          (data: any) => {
            this.categoryVideos = data;
            this.selectedCategory = this.firstLetterBig(category);
            console.log('1111111111111', this.categoryVideos);
          },
          (error: any) => {
            console.error('Error fetching videos:', error);
          }
        );
      }
    });
  }

  logout() {
    localStorage.setItem('logoutInProgress', 'true');
    let userID = localStorage.getItem('userId')?.toString();
    this.userService.userLogout(userID!);
  }
  openSmallMenu() {
    this.shwonProfilSelection = !this.shwonProfilSelection;
  }
  // toggle anzeige
  toggleCategoryMenu(event: MouseEvent) {
    event.stopPropagation();
    this.showCategorySelection = !this.showCategorySelection;
  }

  // prüfe den klick auserhalb der div
  @HostListener('document:click', ['$event'])
  onClick(event: MouseEvent) {
    this.showCategorySelection = false;
  }

  onVideoSelected(video: any) {
    this.selectedVideo = video;
  }

  closeVideoDisplay() {
    this.selectedVideo = null;
  }

  firstLetterBig(string: string): string {
    return string.charAt(0).toUpperCase() + string.slice(1);
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
}
