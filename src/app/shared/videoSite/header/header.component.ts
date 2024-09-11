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

  
  shwonProfilSelection: boolean | null = null;
  showCategorySelection: boolean | null = null;
  showMobileSelection: boolean | null = null;

  constructor(public userService: UserService) {
    this.showCategorySelection = null;
  }

    /**
   * Toggles the visibility of the category selection menu.
   * @param {MouseEvent} event - The mouse event that triggers the menu toggle.
   */
  toggleCategoryMenu(event: MouseEvent) {
    event.stopPropagation();
    this.showCategorySelection = !this.showCategorySelection;
  }

    /**
   * Toggles the visibility of the mobile menu.
   */
  toggleMobileMenu() {
    this.showMobileSelection = !this.showMobileSelection;
  }

    /**
   * Listens for document clicks and closes menus if clicks occur outside.
   * @param {MouseEvent} event - The click event used to check where the user clicked.
   */
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

    /**
   * Logs the user out by triggering the logout process in the UserService.
   */
  logout() {
    localStorage.setItem('logoutInProgress', 'true');
    let userID = localStorage.getItem('userId')?.toString();
    this.userService.userLogout(userID!);
  }

    /**
   * Toggles the visibility of the profile selection menu.
   * @param {MouseEvent} event - The mouse event that triggers the profile menu toggle.
   */
  openSmallMenu(event: MouseEvent) {
    event.stopPropagation();
    this.shwonProfilSelection = !this.shwonProfilSelection;
  }
}
