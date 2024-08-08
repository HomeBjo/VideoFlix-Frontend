import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class VideoService {

  constructor() { }


  async startFetchVideo() {
    const url = 'http://127.0.0.1:8000/videos/get_videos/';
    const response = await fetch(url);
    const jsonData = await response.json();
    console.log('jsonData:', jsonData);
    return jsonData
  }
}
