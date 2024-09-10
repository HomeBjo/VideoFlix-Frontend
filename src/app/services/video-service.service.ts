import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { lastValueFrom, map, Observable, Subject } from 'rxjs';
import { FavoriteBody } from '../interfaces/favorite-body';
import { environment } from '../../environments/environments';
import { VideoJson } from '../interfaces/video-json';

@Injectable({
  providedIn: 'root',
})
export class VideoService {
  headers = new HttpHeaders({ 'Content-Type': 'application/json' });
  allVideos: VideoJson[] = [];
  favVideos: VideoJson[] = [];
  public reloadFavs$ = new Subject<void>();
  constructor(private http: HttpClient) {}

  startFetchVideos(): Observable<any> {
    const url = `${environment.baseUrl}/videos/get_videos/get_videos/`;
    return this.http.get<any>(url, { headers: this.headers });
  }

  fetshFavorites(): Observable<any> {
    const url = `${environment.baseUrl}/videos/get_videos/favorites/`;
    return this.http.get<any>(url, { headers: this.headers });
  }

  loadCategoryVideos(category: string): Observable<any> {
    const url = `${environment.baseUrl}/videos/category/${category}/`;
    return this.http.get<any>(url, { headers: this.headers });
  }

  async fetshFavForFavoriteSite() {
    const loginUrl = `${environment.baseUrl}/videos/get_videos/favorites/`;

    try {
      const response = await lastValueFrom(
        this.http.get<VideoJson[]>(loginUrl, { headers: this.headers })
      );
      if (response) {
        this.favVideos = response;
      }
    } catch (e) {
    }
  }

  async addFavoriteVideo(body: FavoriteBody) {
    const loginUrl = `${environment.baseUrl}/videos/get_videos/toggle_favorite/`;

    try {
      await lastValueFrom(
        this.http.post(loginUrl, body, { headers: this.headers })
      );
    } catch (e) {
    }
  }
}
