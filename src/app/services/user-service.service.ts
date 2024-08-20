import { Injectable } from '@angular/core';
import { RegisterUser } from '../interfaces/register-user';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { lastValueFrom } from 'rxjs';
import { Router } from '@angular/router';
import { environment } from '../../environments/environments';
import { LoginResponse } from '../interfaces/login-response';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  headers = new HttpHeaders({ 'Content-Type': 'application/json' });
  user_name: string = '';
  user_email: string = '';
  user_email_copy: string = '';


  constructor(private http: HttpClient, private router: Router) { }


  async checkGuestUser(){
    let userId = localStorage.getItem('userId')?.toString();
    const token = localStorage.getItem('token');
    const logoutInProgress = localStorage.getItem('logoutInProgress');
    if (logoutInProgress === 'true') {
      localStorage.removeItem('logoutInProgress');
      return;
    }
    if (userId === '11') {
      localStorage.clear();
    } else {
      const user = await this.verifyToken(token!, userId!);
        if (user) {
          this.router.navigateByUrl('/video_site');
        }
    }
  }


  async registerUser(newUser: RegisterUser) {
    const checkEmailUrl = `${environment.baseUrl}/users/check-email/`;
    const registerUrl = `${environment.baseUrl}/users/register/`;

    try {
      const checkEmailResponse = await lastValueFrom(this.http.post<{ exists: boolean }>(checkEmailUrl, { email: newUser.email }, { headers: this.headers }));
      
      if (checkEmailResponse.exists) {
        console.log('E-Mail existiert bereits.');
        this.router.navigateByUrl('/email_exists');
        return true;
      } else {
        this.user_name = newUser.first_name;
        this.user_email = newUser.email;
        this.user_email_copy = newUser.email;
        const body = JSON.stringify(newUser);
        console.log('Sending registration data:', body);
        
        try {
          await lastValueFrom(this.http.post(registerUrl, body, { headers: this.headers }));
          this.router.navigateByUrl('/registration_confirmation');
          return true;
        } catch (e) {
          console.log('Fehler beim Registrieren', e);
          return false;
        }
      }
    } catch (e) {
      console.log('Fehler beim Überprüfen der E-Mail-Adresse', e);
      return false;
    }
  }
  
  async login(email: string, password: string) {
    const loginUrl = `${environment.baseUrl}/users/login/`;
    let userData = {
      email: email,
      password: password
    }
    const body = JSON.stringify(userData);

    try {
      let userDate = await lastValueFrom(this.http.post<LoginResponse>(loginUrl, body, { headers: this.headers }));
      if (userDate) {
        localStorage.removeItem('logoutInProgress');
        this.router.navigateByUrl('/video_site');
        return userDate; 
      }
      return null;
    } catch (e) {
      console.log('Fehler beim Registrieren', e);
      return null;
    }
  }

  async userLogout(userID:string){
    const loginUrl = `${environment.baseUrl}/users/logout/`;
    try {
      await lastValueFrom(this.http.post(loginUrl, { headers: this.headers }));
      this.router.navigateByUrl('/login');
      if (userID === '11') {
        localStorage.clear(); 
        console.log('LocalStorage gelöscht');
      }
    } catch (e) {
      console.log('Fehler beim ausloggen:', e);
    }
  }

  
  async verifyToken(token: string, userId: string) {
    const verifyUrl = `${environment.baseUrl}/users/verify-token/`;
    const body = JSON.stringify({ token, user_id: userId });
    try {
      const user = await lastValueFrom(this.http.post<LoginResponse>(verifyUrl, body, { headers: this.headers }));
      return user;
    } catch (e) {
      console.log('Token ungültig', e);
      return null;
    }
  }
  

}
