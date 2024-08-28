import { Component } from '@angular/core';
import { Router, NavigationEnd, RouterOutlet,Event  } from '@angular/router';
import { filter } from 'rxjs/operators';
import { HeaderComponent } from "./shared/videoSite/header/header.component";
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, HeaderComponent,CommonModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
  title = 'Videoflix';
  
  isVideoSitePage = false;

  constructor(private router: Router) {
    this.router.events.pipe(
      filter((event: Event): event is NavigationEnd => event instanceof NavigationEnd)
    ).subscribe((event: NavigationEnd) => {
      const url = event.urlAfterRedirects;
      
      this.isVideoSitePage = url.includes('video_categorys') || url.includes('video_site') || url.includes('favorite') ;
    });
  }
}
