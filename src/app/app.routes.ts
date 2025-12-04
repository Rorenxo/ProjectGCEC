import { Routes } from '@angular/router';
import { LandingPageComponent } from './landingPage/landing-page.component';
import { RegisterComponent } from "./auth/register/register";

export const routes: Routes = [
  { path: '', component: LandingPageComponent },
  { path: 'register', component: RegisterComponent },
  { path: '**', redirectTo: '', pathMatch: 'full' }
];
