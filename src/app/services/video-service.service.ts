import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { lastValueFrom, map, Observable } from 'rxjs';
import { FavoriteBody } from '../interfaces/favorite-body';
import { environment } from '../../environments/environments';

@Injectable({
  providedIn: 'root'
})
export class VideoService {

  headers = new HttpHeaders({ 'Content-Type': 'application/json' });

  constructor(private http: HttpClient) { }

  startFetchVideos(): Observable<any> {
    const url = `${environment.baseUrl}/videos/get_videos/`;
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

  async setFavorite(body: FavoriteBody) {
    const loginUrl = `${environment.baseUrl}/videos/get_videos/set_favorites/`;

    try {
      await lastValueFrom(this.http.post(loginUrl, body, { headers: this.headers }));
      console.log(`user mit token: ${this.headers} hat das Video mit id: ${body.fav_videos} favorisiert`);
    } catch (e) {
      console.log('Fehler beim favoresieren:', e);
    }
  }
}
