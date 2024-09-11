import { Component,ViewChild  } from '@angular/core';
import { Router, NavigationEnd, RouterOutlet,Event  } from '@angular/router';
import { filter } from 'rxjs/operators';
import { HeaderComponent } from "./shared/videoSite/header/header.component";
import { CommonModule } from '@angular/common';
import { ToastComponent } from './shared/toast/toast.component';
import { ToastServiceService } from './services/toast-service.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, HeaderComponent,CommonModule,ToastComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
  title = 'Videoflix';
  /** Reference to the ToastComponent */
  @ViewChild(ToastComponent) toastComponent!: ToastComponent;
  
  isVideoSitePage = false;

    /**
   * Constructor for the AppComponent.
   * Sets up router event listener to track URL changes.
   * 
   * @param {Router} router - The Angular Router instance used for navigation events.
   * @param {ToastServiceService} toastService - Service for managing toast notifications.
   */
  
  constructor(private router: Router,private toastService: ToastServiceService) {
    
    this.router.events.pipe(
      filter((event: Event): event is NavigationEnd => event instanceof NavigationEnd)
    ).subscribe((event: NavigationEnd) => {
      const url = event.urlAfterRedirects;
      
      this.isVideoSitePage = url.includes('video_categorys') || url.includes('video_site') || url.includes('favorite') ;
    });
  }

    /**
   * Lifecycle hook that runs after the view has been initialized.
   * Assigns the ToastComponent to the ToastService for centralized management.
   */
  ngAfterViewInit() {
    this.toastService.setToastComponent(this.toastComponent);
  }
}
