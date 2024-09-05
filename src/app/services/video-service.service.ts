import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { lastValueFrom, map, Observable } from 'rxjs';
import { FavoriteBody } from '../interfaces/favorite-body';
import { environment } from '../../environments/environments';
import { VideoJson } from '../interfaces/video-json';

@Injectable({
  providedIn: 'root'
})
export class VideoService {

  headers = new HttpHeaders({ 'Content-Type': 'application/json' });
  allVideos: VideoJson[] = [];
  favVideos: VideoJson[] = [];

  constructor(private http: HttpClient) { }

  startFetchVideos(): Observable<any> {
    const url = `${environment.baseUrl}/videos/get_videos/get_videos/`;
    return this.http.get<any>(url, { headers: this.headers });
  }


  fetshFavorites(): Observable<any> {
    const url = `${environment.baseUrl}/videos/get_videos/favorites/`;
    return this.http.get<any>(url, { headers: this.headers });
  }

  // loadCategoryVideos(category:string): Observable<any> {
  //   const url = `${environment.baseUrl}/videos/category/${category}/`;
  //   return this.http.get<any>(url, { headers: this.headers }).pipe(
  //     map((data: any[]) => {
  //       return data.map((video: any) => {
  //         video.screenshot = `${environment.baseUrl}${video.screenshot}`;
  //         video.video_folder = `${environment.baseUrl}${video.video_folder}`;
  //         return video;
  //       });
  //     })
  //   );
  // }   hier die version ausgelagert im service das wen man die pfad der screenshots und folder nicht im backend setzt 

  loadCategoryVideos(category: string): Observable<any> {
    const url = `${environment.baseUrl}/videos/category/${category}/`;
    return this.http.get<any>(url, { headers: this.headers });
  }


  // async fetshFavorites() {
  //   const loginUrl = `${environment.baseUrl}/videos/get_videos/favorites/`;

  //   try{
  //     const response = await lastValueFrom(this.http.get<VideoJson[]>(loginUrl, { headers: this.headers }));
  //     if (response) {
  //       this.favVideos = response;
  //       console.log('favVideos:',this.favVideos);
  //     }
  //   } catch(e) {
  //     console.log('Fehler beim fetshen der favoriten:', e);
  //   }
  // }


  async addFavoriteVideo(body: FavoriteBody) {
    const loginUrl = `${environment.baseUrl}/videos/get_videos/toggle_favorite/`;

    try {
      await lastValueFrom(this.http.post(loginUrl, body, { headers: this.headers }));
      console.log(`user mit token: ${this.headers} hat das Video mit id: ${body.fav_video} favorisiert`);
    } catch (e) {
      console.log('Fehler beim favoresieren:', e);
    }
  }
}
