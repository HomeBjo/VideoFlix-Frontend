import { Injectable } from '@angular/core';
import { RegisterUser } from '../interfaces/register-user';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { lastValueFrom } from 'rxjs';
import { Router } from '@angular/router';
import { environment } from '../../environments/environments';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  headers = new HttpHeaders({ 'Content-Type': 'application/json' });
  user_name: string = '';
  user_email: string = '';
  constructor(private http: HttpClient, private router: Router) { }


  /**
   * Retrieves the current user's ID from local storage.
   * @returns {string|number|undefined} The ID of the current user if found in local storage, otherwise undefined.
   */
  getCurrentUserId() {
    let currentUser = localStorage.getItem('currentUser');
    if (currentUser !== null) {
      return JSON.parse(currentUser);
    }
  }


  async registerUser(newUSer: RegisterUser) {
    this.user_name = newUSer.username;
    this.user_email = newUSer.email;
    const url = `${environment.baseUrl}/users/register/`;
    const body = JSON.stringify(newUSer);
    console.log('Sending registration data:', body);
    try {
      await lastValueFrom(this.http.post(url, body, { headers: this.headers }));
      this.router.navigateByUrl('/registration_confirmation');
    } catch (e) {
        console.log('Fehler beim Registrieren', e);
    }
    setTimeout(() => {
      this.user_name = '';
      this.user_email = '';
    }, 2000);
  }



  
}
