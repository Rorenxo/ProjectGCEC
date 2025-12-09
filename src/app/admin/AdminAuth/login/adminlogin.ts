import { ChangeDetectorRef, Component } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, ReactiveFormsModule, ValidationErrors, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth, db } from '../../../UTILS/firebase';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faEye, faEyeSlash, faSpinner, faCheckCircle } from '@fortawesome/free-solid-svg-icons';
import { doc, getDoc } from 'firebase/firestore';

export function adminEmailValidator(control: AbstractControl): ValidationErrors | null {
  if (!control.value) {
    return null;
  }
  const email: string = control.value;
  const emailParts = email.split('@');

  if (emailParts.length !== 2) return null;

  const domainPart = emailParts[1];

  if (domainPart !== 'gcadmin.edu.ph') {
    return { domainMismatch: true };
  }

  return null;
}
@Component({
  selector: 'app-admin-login',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    RouterModule,
    FontAwesomeModule
  ],
  templateUrl: './adminlogin.html',
  styleUrls: ['./adminlogin.css']
})
export class AdminLoginComponent {
  loginForm: FormGroup;
  hidePassword = true;
  isLoading = false;
  loginSuccess = false;
  loginError: string | null = null;

  faEye = faEye;
  faEyeSlash = faEyeSlash;
  faSpinner = faSpinner;
  faCheckCircle = faCheckCircle;

  constructor(private fb: FormBuilder, private router: Router, private cdr: ChangeDetectorRef) {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email, adminEmailValidator]],
      password: ['', [Validators.required, Validators.minLength(6)]]
    });
  }

  async login() {
    if (this.loginForm.valid) {
      this.isLoading = true;
      this.loginSuccess = false;
      this.loginError = null;
      this.cdr.detectChanges();

      const { email, password } = this.loginForm.value;
      try {
        const userCredential = await signInWithEmailAndPassword(auth, email, password);
        const user = userCredential.user;
        const adminDocRef = doc(db, 'admins', user.uid);
        const adminDocSnap = await getDoc(adminDocRef);

        if (adminDocSnap.exists()) {
          console.log('Successfully logged in admin:', user);
          this.isLoading = false;
          this.loginSuccess = true;
          this.cdr.detectChanges();
          setTimeout(() => this.router.navigate(['/admin']), 1500);
        } else {
          this.isLoading = false;
          this.loginError = 'You are not authorized as an admin.';
          this.cdr.detectChanges();
          await auth.signOut();
        }
      } catch (error: any) {
        await auth.signOut(); 
        this.isLoading = false;
        this.loginError = 'Invalid email or password. Please try again.';
        console.error('Login failed:', error.code, error.message);
        this.cdr.detectChanges();
      }
    }
  }

  togglePasswordVisibility(): void {
    this.hidePassword = !this.hidePassword;
  }
}