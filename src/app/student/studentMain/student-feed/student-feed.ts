import { Component, OnInit } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatListModule } from '@angular/material/list';
import { MatDividerModule } from '@angular/material/divider';
import { Router } from '@angular/router';
import { Event, EventService } from '../../../admin/event.service';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Component({
  selector: 'app-student',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatIconModule,
    MatButtonModule,
    MatListModule,
    MatDividerModule,
  ],
  templateUrl: './student-feed.html',
  styleUrl: './student-feed.css'
})
export class StudentFeed implements OnInit {
  recentEvents$!: Observable<Event[]>;

  constructor(private eventService: EventService, private router: Router) {}

  ngOnInit(): void {
    const events$ = this.eventService.events$;

    this.recentEvents$ = events$.pipe(map(
      events => [...events].sort((a, b) => new Date(b.startDate).getTime() - new Date(a.startDate).getTime())
    ));
  }
}