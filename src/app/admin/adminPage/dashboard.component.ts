import { Component, OnInit } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatListModule } from '@angular/material/list';
import { MatDividerModule } from '@angular/material/divider';
import { Router } from '@angular/router';
import { Event, EventService } from '../event.service';
import { Observable, combineLatest } from 'rxjs';
import { map } from 'rxjs/operators';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatIconModule,
    MatButtonModule,
    MatListModule,
    MatDividerModule,
  ],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css'
})
export class DashboardComponent implements OnInit {
  stats$!: Observable<{ label: string; value: number; icon: string; }[]>;
  recentEvents$!: Observable<Event[]>;

  constructor(private eventService: EventService, private router: Router) {}

  ngOnInit(): void {
    const events$ = this.eventService.events$;
    const students$ = this.eventService.students$;

    this.stats$ = combineLatest([events$, students$]).pipe(
      map(([events, students]) => {
        const today = new Date();
        const eventsTodayCount = events.filter(e => {
          const eventDate = new Date(e.startDate);
          return eventDate.getDate() === today.getDate() &&
            eventDate.getMonth() === today.getMonth() &&
            eventDate.getFullYear() === today.getFullYear();
        }).length;

        return [
          { label: 'Total Events', value: events.length, icon: 'event' },
          { label: 'Total Students', value: students.length, icon: 'people' },
          { label: 'Events Today', value: eventsTodayCount, icon: 'today' },
        ];
      })
    );

    // Use all events for the list, sorted by most recent
    this.recentEvents$ = events$.pipe(map(
      events => [...events].sort((a, b) => new Date(b.startDate).getTime() - new Date(a.startDate).getTime())
    ));
  }

  goToCreateEvent(): void {
    this.router.navigate(['/create']);
  }
}