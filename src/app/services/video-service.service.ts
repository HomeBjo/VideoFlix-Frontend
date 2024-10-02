import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { lastValueFrom, Observable, Subject } from 'rxjs';
import { FavoriteBody } from '../interfaces/favorite-body';
import { environment } from '../../environments/environments';
import { VideoJson } from '../interfaces/video-json';
import { ToastServiceService } from './toast-service.service';

@Injectable({
  providedIn: 'root',
})
export class VideoService {
  headers = new HttpHeaders({ 'Content-Type': 'application/json' });
  allVideos: VideoJson[] = [];
  favVideos: VideoJson[] = [];
  public reloadFavs$ = new Subject<void>();
  
  constructor(private http: HttpClient, private toastService: ToastServiceService) {}

    /**
   * Starts fetching all videos from the server.
   * @returns {Observable<any>} - An observable with the video data.
   */
  startFetchVideos(): Observable<any> {
    const url = `${environment.baseUrl}/videos/get_videos/get_videos/`;
    return this.http.get<any>(url, { headers: this.headers });
  }

    /**
   * Fetches the user's favorite videos from the server.
   * @returns {Observable<any>} - An observable containing the user's favorite videos.
   */
  fetchFavorites(): Observable<any> {
    const url = `${environment.baseUrl}/videos/get_videos/favorites/`;
    return this.http.get<any>(url, { headers: this.headers });
  }

    /**
   * Loads videos from a specific category.
   * @param {string} category - The name of the category to load videos from.
   * @returns {Observable<any>} - An observable containing the videos from the specified category.
   */
  loadCategoryVideos(category: string): Observable<any> {
    const url = `${environment.baseUrl}/videos/category/${category}/`;
    return this.http.get<any>(url, { headers: this.headers });
  }

  /**
 * Loads the top 5 most recent videos.
 * @returns {Observable<any>} - An observable containing the top 5 videos.
 */
  loadTop5Videos(): Observable<any> {
    const url = `${environment.baseUrl}/videos/get_videos/top5/`;
    return this.http.get<any>(url, { headers: this.headers });
  }

    /**
   * Adds or removes a video from the user's favorites.
   * @param {FavoriteBody} body - The body containing the video information to be toggled as favorite.
   */
  async addFavoriteVideo(body: FavoriteBody) {
    const loginUrl = `${environment.baseUrl}/videos/get_videos/toggle_favorite/`;

    try {
      await lastValueFrom(
        this.http.post(loginUrl, body, { headers: this.headers })
      );
    } catch (e) {
      const errorMessage = 'Oops, something went wrong. Please try again.';
      this.toastService.showMessage(errorMessage, 'error');
    }
  }
}
