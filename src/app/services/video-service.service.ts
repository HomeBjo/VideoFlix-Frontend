import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { lastValueFrom } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class VideoService {

  constructor(private http: HttpClient) { }

  async startFetchVideos() {
    const url = 'http://127.0.0.1:8000/videos/get_videos/';
    return await lastValueFrom(this.http.get<any>(url));
  }
}
