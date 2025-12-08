import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { NavbarComponent } from '../components/navbar/navbar.component';
import { FooterComponent } from '../components/footer/footer.component';

@Component({
  standalone: true,
  selector: 'app-main-layout',
  template: `
    <app-navbar></app-navbar> 
    <main class="content-area">
      <router-outlet></router-outlet> </main>
    <app-footer></app-footer> `,
  imports: [RouterOutlet, NavbarComponent, FooterComponent]
})
export class MainLayoutComponent {}