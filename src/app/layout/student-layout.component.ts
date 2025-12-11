
import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { StudentNavbarComponent } from '../student/studnav/stnav';

@Component({
  standalone: true,
  selector: 'app-student-layout',
  template: `
<app-student-navbar></app-student-navbar>
    <main class="full-screen-content">
      <router-outlet></router-outlet> </main>
    `,
  imports: [RouterOutlet, StudentNavbarComponent]
})
export class StudentLayoutComponent {}