import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { Router } from '@angular/router';

import { Event, EventService } from '../../../admin/event.service';

import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { EventCard } from '../event-card/event-card.component';


@Component({
  selector: 'app-student',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatIconModule,
    MatButtonModule,
    EventCard
  ],
  templateUrl: './student-feed.html',
  styleUrl: './student-feed.css'
})
export class StudentFeed implements OnInit {

  recentEvents$!: Observable<Event[]>;
  featuredEvent: Event | null = null;

  constructor(
    private eventService: EventService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.recentEvents$ = this.eventService.events$.pipe(
      map(events =>
        [...events].sort(
          (a, b) =>
            new Date(b.startDate).getTime() -
            new Date(a.startDate).getTime()
        )
      )
    );

    this.recentEvents$.subscribe(events => {
      this.featuredEvent = events.length ? events[0] : null;
    });
  }

  openEventDetails(event: Event) {
    this.router.navigate(['/events', event.id]);
  }
}
