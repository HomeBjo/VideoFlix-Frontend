import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { lastValueFrom, map, Observable } from 'rxjs';
import { environment } from '../../environments/environments';

@Injectable({
  providedIn: 'root'
})
export class VideoService {

  headers = new HttpHeaders({ 'Content-Type': 'application/json' });

  constructor(private http: HttpClient) { }

  startFetchVideos(): Observable<any> {
    const url = 'http://127.0.0.1:8000/videos/get_videos/';
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
}
