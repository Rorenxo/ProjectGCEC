import { ChangeDetectorRef, Component } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, ReactiveFormsModule, ValidationErrors, Validators, } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { doc, setDoc } from 'firebase/firestore';
import { auth, db } from '../../../UTILS/firebase';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faEye, faEyeSlash, faCheckCircle } from '@fortawesome/free-solid-svg-icons';

export function passwordMatchValidator(control: AbstractControl): ValidationErrors | null {
  const password = control.get('password');
  const confirmPassword = control.get('confirmPassword');

  if (password && confirmPassword && password.value !== confirmPassword.value) {
    return { passwordMismatch: true };
  }

  return null;
}

export function gcEmailValidator(control: AbstractControl): ValidationErrors | null {
  const emailControl = control.get('email');
  if (!emailControl?.value) {
    return null;
  }

  const email: string = emailControl.value;
  const emailParts = email.split('@');

  if (emailParts.length !== 2) return null;

  const domainPart = emailParts[1];

  if (domainPart !== 'gcadmin.edu.ph') {
    return { domainMismatch: true };
  }

  return null; 
}
@Component({
  selector: 'app-admin-register',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    RouterModule,
    FontAwesomeModule
  ],
  templateUrl: './adminregister.html',
  styleUrls: ['./adminregister.css']
})
export class AdminRegisterComponent {
  registerForm: FormGroup;
  hidePassword = true;
  hideConfirmPassword = true;
  faEye = faEye;
  faEyeSlash = faEyeSlash;
  faCheckCircle = faCheckCircle;
  registrationSuccess = false; 

  constructor(private fb: FormBuilder, private cdr: ChangeDetectorRef) {
    this.registerForm = this.fb.group({
      userType: ['admin', Validators.required],
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      confirmPassword: ['', Validators.required]
    }, { validators: [passwordMatchValidator, gcEmailValidator] });
  }

  async register() {
    if (this.registerForm.valid) {
      const { userType, firstName, lastName, email, password } = this.registerForm.value;
      try {
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        const user = userCredential.user;
        console.log('Successfully registered user:', user);

        const collectionName = userType === 'admin' ? 'admins' : 'students';

        await setDoc(doc(db, collectionName, user.uid), {
          firstName: firstName,
          lastName: lastName,
          email: email,
          role: userType
        });
        console.log('User data saved to Firestore');
        this.registrationSuccess = true; 
        this.cdr.detectChanges(); 
      } catch (error: any) {
        const errorCode = error.code;
        const errorMessage = error.message;
        console.error('Registration failed:', errorCode, errorMessage);
      }
    }
  }

  togglePasswordVisibility(): void {
    this.hidePassword = !this.hidePassword;
  }

  toggleConfirmPasswordVisibility(): void {
    this.hideConfirmPassword = !this.hideConfirmPassword;
  }
}