import { Injectable } from '@angular/core';
import { RegisterUser } from '../interfaces/register-user';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { BehaviorSubject, lastValueFrom, Observable } from 'rxjs';
import { Router } from '@angular/router';
import { environment } from '../../environments/environments';
import { LoginResponse } from '../interfaces/login-response';
import { GUEST_ID } from '../../../config';
import { UserData } from '../interfaces/user-data';
@Injectable({
  providedIn: 'root'
})
export class UserService {

  headers = new HttpHeaders({ 'Content-Type': 'application/json' });
  user_name: string = '';
  user_email: string = '';
  user_email_copy: string = '';
  userData: UserData | undefined;
  private userDataSubject = new BehaviorSubject<UserData[] | null>(null); //spezielle art von Observable, die immer den letzten Wert speichert und diesen neuen abonnenten sofort bereitstellt
  userData$ = this.userDataSubject.asObservable(); // kovertiere die daten zu einer Observable - kann abonniert werden
  

  constructor(private http: HttpClient, private router: Router) { }


  async checkGuestUser(){
    let userId = localStorage.getItem('userId')?.toString();
    const token = localStorage.getItem('token');
    const logoutInProgress = localStorage.getItem('logoutInProgress');
    if (logoutInProgress === 'true') {
      localStorage.removeItem('logoutInProgress');
      return;
    }
    if (userId === GUEST_ID) {
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
        return this.checkUserToken(newUser, registerUrl);
      }
    } catch (e) {
      console.log('Fehler beim Überprüfen der E-Mail-Adresse', e);
      return false;
    }
  }


  async checkUserToken(newUser: RegisterUser, registerUrl: string) {
    this.user_name = newUser.first_name;
    this.user_email = newUser.email;
    this.user_email_copy = newUser.email;
    const body = JSON.stringify(newUser);
    
    try {
      await lastValueFrom(this.http.post(registerUrl, body, { headers: this.headers }));
      this.router.navigateByUrl('/registration_confirmation');
      return true;
    } catch (e) {
      console.log('Fehler beim Registrieren', e);
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
      if (userID === GUEST_ID) {
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
  

  async sendPasswordResetEmail(email: string): Promise<boolean> {
    const resetUrl = `${environment.baseUrl}/password_reset/`; 

    try {
      const emailData = { email: email };
      await lastValueFrom(this.http.post(resetUrl, emailData, { headers: this.headers }));
      console.log('E-Mail wurde erfolgreich gesendet');
      return true;
    } catch (e) {
      console.error('Fehler beim Senden der E-Mail:', e);
      return false;
    }
  }


  async sendNewPassword(newPassword: string, uid: string | null, token: string | null): Promise<boolean> {
    const resetUrl = `${environment.baseUrl}/password_reset/confirm/${uid}/${token}/`;
    
    try {
      const passwordData = {
        new_password1: newPassword, 
        new_password2: newPassword
      };
      await lastValueFrom(this.http.post(resetUrl, passwordData, { headers: this.headers }));
      return true;
    } catch (e) {
      return false;
    }
  }


  // async getUserData() { //fetsht die daten vom eingeloggten user
  //   if (this.userData === undefined) { // check ob userDataSubject leer ist
  //     const userId = localStorage.getItem('userId');
  //     const url = `${environment.baseUrl}/users/user-data/?userId=${userId}`; //suchge direkt nach dem user in der url
      
  //     try {
  //       //starte get anfrage - kein header benötigt, weil user für diese angfrage authentiziert sein muss
  //       let user = await lastValueFrom(this.http.get<UserData[]>(url));
  //       if (user) {
  //         this.userDataSubject.next(user); // speicher die daten nach der get anfrage
  //         console.log('fetshed userdata:', this.userDataSubject.getValue());
  //       }
  //     } catch (e) {
  //       console.error('Fehler beim Laden der UserData:', e);
  //     }
  //   }
  // }
  async getUserData() { //fetsht die daten vom eingeloggten user
    if (this.userData === undefined) { // check ob userDataSubject leer ist
      const userId = localStorage.getItem('userId');
      const url = `${environment.baseUrl}/users/user-data/?userId=${userId}`; //suchge direkt nach dem user in der url
      
      try {
        //starte get anfrage - kein header benötigt, weil user für diese angfrage authentiziert sein muss
        let user = await lastValueFrom(this.http.get<UserData[]>(url));
        if (user) {
          return user;
        }
      } catch (e) {
        console.error('Fehler beim Laden der UserData:', e);
        return null;
      }
    }
    return null;
  }
  
}
