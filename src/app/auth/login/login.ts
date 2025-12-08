import { Component } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, ReactiveFormsModule, ValidationErrors, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth, db } from '../../UTILS/firebase';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faEye, faEyeSlash } from '@fortawesome/free-solid-svg-icons';

export function gordonCollegeEmailValidator(control: AbstractControl): ValidationErrors | null {
  if (!control.value) {
    return null;
  }
  const email: string = control.value;
  const emailParts = email.split('@');

  if (emailParts.length !== 2) return null;

  const domainPart = emailParts[1];

  if (domainPart !== 'gordoncollege.edu.ph') {
    return { domainMismatch: true };
  }

  return null;
}
@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    RouterModule,
    FontAwesomeModule
  ],
  templateUrl: './login.html',
  styleUrls: ['./login.css']
})
export class LoginComponent {
  loginForm: FormGroup;
  hidePassword = true;
  faEye = faEye;
  faEyeSlash = faEyeSlash;

  constructor(private fb: FormBuilder, private router: Router) {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email, gordonCollegeEmailValidator]],
      password: ['', [Validators.required, Validators.minLength(6)]]
    });
  }

  async login() {
    if (this.loginForm.valid) {
      const { email, password } = this.loginForm.value;
      try {
        const userCredential = await signInWithEmailAndPassword(auth, email, password);
        const user = userCredential.user;
        console.log('Successfully logged in user:', user);
        // Redirect to a dashboard or home page on successful login
        this.router.navigate(['/dashboard']);
      } catch (error: any) {
        const errorCode = error.code;
        const errorMessage = error.message;
        console.error('Login failed:', errorCode, errorMessage);
        // Here you could display an error message to the user
      }
    }
  }

  togglePasswordVisibility(): void {
    this.hidePassword = !this.hidePassword;
  }
}