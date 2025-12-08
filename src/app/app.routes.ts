import { Routes } from '@angular/router';
import { LandingPageComponent } from './landingPage/landing-page.component';
import { RegisterComponent } from "./auth/register/register";
import { LoginComponent } from "./auth/login/login";

export const routes: Routes = [
  { path: '', component: LandingPageComponent },
  { path: 'register', component: RegisterComponent },
  { path: 'login', component: LoginComponent },
  { path: '**', redirectTo: '', pathMatch: 'full' }
];
