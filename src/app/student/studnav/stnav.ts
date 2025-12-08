import { Component } from '@angular/core';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';
import { CommonModule } from '@angular/common';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';


@Component({
  selector: 'app-admin-navbar',
  standalone: true,
  imports: [CommonModule, MatToolbarModule, MatButtonModule, MatIconModule, RouterLink, RouterLinkActive],
  templateUrl: './stnav.html',
  styleUrls: ['./stnav.css']
})
export class StudentNavbarComponent {
  isMenuOpen = false;

  constructor(private router: Router) {}

  toggleMenu() {
    this.isMenuOpen = !this.isMenuOpen;
  }

  closeMenu() {
    this.isMenuOpen = false;
  }

  navigateToDashboard() {
    this.router.navigate(['/dashboard']);
  }

  navigateToCreateEvent() {
    this.router.navigate(['/create']);
  }

  logout(): void {
    this.closeMenu();
    this.router.navigate(['/']);
  }
}
