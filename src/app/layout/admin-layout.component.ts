
import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { AdminNavbarComponent } from '../admin/adminnavbar/adnav';

@Component({
  standalone: true,
  selector: 'app-admin-layout',
  template: `
    <app-admin-navbar></app-admin-navbar>
    <main class="full-screen-content">
      <router-outlet></router-outlet>
    </main>
  `,
  imports: [RouterOutlet, AdminNavbarComponent]
})
export class AdminLayoutComponent {}
