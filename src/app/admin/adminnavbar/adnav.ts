import { Component } from '@angular/core';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';
import { CommonModule } from '@angular/common';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatDialog } from '@angular/material/dialog';
import { ConfirmDialogComponent } from '../adminPage/confirm-dialog.component';

@Component({
  selector: 'app-admin-navbar',
  standalone: true,
  imports: [CommonModule, MatToolbarModule, MatButtonModule, MatIconModule, RouterLink, RouterLinkActive],
  templateUrl: './adnav.html',
  styleUrls: ['./adnav.css']
})
export class AdminNavbarComponent {
  isMenuOpen = false;

  constructor(private router: Router, private dialog: MatDialog) {}

  toggleMenu() {
    this.isMenuOpen = !this.isMenuOpen;
  }

  closeMenu() {
    this.isMenuOpen = false;
  }

  confirmLogout(): void {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      width: '350px',
      data: {
        title: 'Confirm Logout',
        message: 'Are you sure you want to log out?',
        confirmButtonText: 'Logout',
        confirmButtonColor: 'warn'
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.logout();
      }
    });
  }

  logout(): void {
    console.log('User confirmed logout.');
    this.closeMenu();
    this.router.navigate(['/login']);
  }
}
