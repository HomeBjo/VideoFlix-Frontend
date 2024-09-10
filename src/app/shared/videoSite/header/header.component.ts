import { CommonModule } from '@angular/common';
import { Component, HostListener } from '@angular/core';
import { UserService } from '../../../services/user-service.service';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss',
})
export class HeaderComponent {
  constructor(
    public userService: UserService
  ) {}
  shwonProfilSelection: boolean = false;
  showCategorySelection: boolean = false;
  showMobileSelection: boolean = false;

  toggleCategoryMenu(event: MouseEvent) {
    event.stopPropagation();
    this.showCategorySelection = !this.showCategorySelection;
  }
  toggleMobileMenu() {
    this.showMobileSelection = !this.showMobileSelection;
  }

  @HostListener('document:click', ['$event'])
  handleOutsideClick(event: MouseEvent) {
    const target = event.target as HTMLElement;
   
    if (
      !target.closest('.mobileSection') &&
      !target.closest('.burgerMenuIcon')
    ) {
      this.showMobileSelection = false;
    }
    
    if (
      !target.closest('.categorySelection') &&
      !target.closest('.headerBtn')
    ) {
      this.showCategorySelection = false;
    }
    if (
      !target.closest('slideInAnimation') &&
      !target.closest('slideOutAnimation')
    ) {
      this.shwonProfilSelection = false;
    }
  }

  logout() {
    localStorage.setItem('logoutInProgress', 'true');
    let userID = localStorage.getItem('userId')?.toString();
    this.userService.userLogout(userID!);
  }
  openSmallMenu(event: MouseEvent) {
    event.stopPropagation();
    this.shwonProfilSelection = !this.shwonProfilSelection;
  }
}
