import { Injectable } from '@angular/core';
import { RegisterUser } from '../interfaces/register-user';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { lastValueFrom } from 'rxjs';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  headers = new HttpHeaders({ 'Content-Type': 'application/json' });

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
    const url = 'http://127.0.0.1:8000/users/register/';
    const body = JSON.stringify(newUSer);
    try {
      let response = (await lastValueFrom(this.http.post<RegisterResponse>(url, body, { headers: this.headers })));
      if (response) {
        localStorage.setItem('token', response.token);
      }
      // this.router.navigateByUrl('/todos');
    } catch (e) {
        console.log('Fehler beim Registrieren', e);
    }
  }
}
