import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { lastValueFrom, Observable } from 'rxjs';

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
}
