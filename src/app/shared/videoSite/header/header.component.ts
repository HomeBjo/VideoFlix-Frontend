import { CommonModule } from '@angular/common';
import { Component, HostListener } from '@angular/core';
import { UserService } from '../../../services/user-service.service';
import { VideoService } from '../../../services/video-service.service';
import { RouterLink,ActivatedRoute } from '@angular/router';



@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule,RouterLink],
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss'
})
export class HeaderComponent {
  constructor(public userService: UserService, private videoService: VideoService, private route: ActivatedRoute) {}
  shwonProfilSelection:boolean = false;
  showCategorySelection:boolean = false;

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

    logout(){
      localStorage.setItem('logoutInProgress', 'true');
      let userID = localStorage.getItem('userId')?.toString();
      this.userService.userLogout(userID!);
    }
    openSmallMenu(){
      this.shwonProfilSelection = !this.shwonProfilSelection;
    }
  

}
