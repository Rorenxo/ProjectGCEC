
import { Routes } from '@angular/router';
import { LandingPageComponent } from './landingPage/landing-page.component';
import { RegisterComponent } from "./auth/register/register";
import { LoginComponent } from "./auth/login/login";

import { AdminLoginComponent } from './admin/AdminAuth/login/adminlogin';
import { AdminRegisterComponent } from './admin/AdminAuth/register/adminregister';
import { DashboardComponent } from './admin/adminPage/dashboard.component';
import { CreateEventComponent } from './admin/adminPage/create.component';
import { EditEventComponent } from './admin/adminPage/edit.component';

import { StudentFeed } from './student/studentMain/student-feed/student-feed';
import { EventCard } from './student/studentMain/event-card/event-card.component';


import { MainLayoutComponent } from './layout/main-layout.component';
import { StudentLayoutComponent } from './layout/student-layout.component';
import { AdminLayoutComponent } from './layout/admin-layout.component';

export const routes: Routes = [
  {
    path: '',
    component: MainLayoutComponent,
    children: [
      { path: '', component: LandingPageComponent },
      { path: 'register', component: RegisterComponent },
      { path: 'login', component: LoginComponent },
      { path: 'adminlogin', component: AdminLoginComponent },
      { path: 'adminregister', component: AdminRegisterComponent },
    ]
  },
  {
    path: 'admin',
    component: AdminLayoutComponent,
    children: [
      { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
      { path: 'dashboard', component: DashboardComponent },
      { path: 'create', component: CreateEventComponent },
      { path: 'edit/:id', component: EditEventComponent }, 
    ]
  },

  {
    path: 'student',
    component: StudentLayoutComponent,
    children: [
      { path: '', component: StudentFeed  }, 
      { path: 'event/:id', component: EventCard  },
    ]
  },
  { path: '**', redirectTo: '', pathMatch: 'full' }
];