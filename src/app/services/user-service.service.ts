import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  constructor() { }


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
}
