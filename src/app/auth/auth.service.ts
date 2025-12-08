import { Injectable } from '@angular/core';
import { Auth, onAuthStateChanged, User, signOut } from 'firebase/auth';
import { Router } from '@angular/router';
import { BehaviorSubject, Observable } from 'rxjs';
import { auth } from '../UTILS/firebase';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private userSubject = new BehaviorSubject<User | null>(null);
  user$: Observable<User | null> = this.userSubject.asObservable();

  constructor(private router: Router) {
    onAuthStateChanged(auth, user => {
      this.userSubject.next(user);
    });
  }

  async logout(): Promise<void> {
    try {
      await signOut(auth);
      this.router.navigate(['/login']);
    } catch (error) {
      console.error('Logout failed:', error);
    }
  }
}