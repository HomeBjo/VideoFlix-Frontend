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
  showMobileSelection:boolean = false;

    // toggle anzeige 
    toggleCategoryMenu(event: MouseEvent) {
      event.stopPropagation();
      this.showCategorySelection = !this.showCategorySelection;
    }
    toggleMobileMenu(){
      this.showMobileSelection = !this.showMobileSelection;
    }
  
  // prüfe den klick auserhalb der div
    // @HostListener('document:click', ['$event'])
    // onClick(event: MouseEvent) {
    //   this.showCategorySelection = false;
    //   this.shwonProfilSelection = false;
    // }
    
    @HostListener('document:click', ['$event'])
    handleOutsideClick(event: MouseEvent) {
      const target = event.target as HTMLElement;
      // Schließe das mobile Menü, wenn außerhalb des Menüs geklickt wird
      if (!target.closest('.mobileSection') && !target.closest('.burgerMenuIcon')) {
        this.showMobileSelection = false;
      }
      // Schließe das Kategorie-Menü, wenn außerhalb geklickt wird
      if (!target.closest('.categorySelection') && !target.closest('.headerBtn')) {
        this.showCategorySelection = false;
      }
      if(!target.closest('slideInAnimation')&& !target.closest('slideOutAnimation')){
        this.shwonProfilSelection = false;
      }
    }

    logout(){
      localStorage.setItem('logoutInProgress', 'true');
      let userID = localStorage.getItem('userId')?.toString();
      this.userService.userLogout(userID!);
    }
    openSmallMenu(event: MouseEvent){
      event.stopPropagation();
      this.shwonProfilSelection = !this.shwonProfilSelection;
    }
  

}
