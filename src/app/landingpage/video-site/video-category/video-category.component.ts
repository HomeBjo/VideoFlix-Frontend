import { CommonModule } from '@angular/common';
import { Component, HostListener } from '@angular/core';
import { UserService } from '../../../services/user-service.service';
import { VideoService } from '../../../services/video-service.service';
import { RouterLink,ActivatedRoute } from '@angular/router';
import { VideoJson } from '../../../interfaces/video-json';
import { VideoPreviewComponent } from "../video-preview/video-preview.component";
import { VideoDisplayComponent } from '../video-display/video-display.component';




@Component({
  selector: 'app-video-category',
  standalone: true,
  imports: [CommonModule, RouterLink, VideoPreviewComponent, VideoDisplayComponent],
  templateUrl: './video-category.component.html',
  styleUrl: './video-category.component.scss'
})
export class VideoCategoryComponent {
  shwonProfilSelection:boolean = false;
  showCategorySelection:boolean = false;
  selectedVideo: any;
  categoryVideos: VideoJson[] = [];
  selectedCategory: string | null = null;


  constructor(public userService: UserService, private videoService: VideoService, private route: ActivatedRoute) {}


  ngOnInit() {
    this.route.paramMap.subscribe(params => {
      const category = params.get('category');
      if (category) {
        this.videoService.loadCategoryVideos(category).subscribe((data: any) => {
          this.categoryVideos = data;
          this.selectedCategory = this.firstLetterBig(category);
          console.log('1111111111111',this.categoryVideos);
        }, (error: any) => {
          console.error('Error fetching videos:', error);
        });
      }
    });
  }
    

  logout(){
    localStorage.setItem('logoutInProgress', 'true');
    let userID = localStorage.getItem('userId')?.toString();
    this.userService.userLogout(userID!);
  }
  openSmallMenu(){
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

}
