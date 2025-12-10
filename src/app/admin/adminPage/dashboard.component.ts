import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatListModule } from '@angular/material/list';
import { MatDividerModule } from '@angular/material/divider';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { Event, EventService } from '../event.service';
import { Observable, combineLatest } from 'rxjs';
import { map } from 'rxjs/operators';
import { ConfirmDialogComponent } from './confirm-dialog.component';

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
    MatDialogModule,
    DatePipe,
  ],
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css'],
  
})
export class DashboardComponent implements OnInit, OnDestroy {
  stats$!: Observable<{ label: string; value: number; icon: string; }[]>;
  recentEvents$!: Observable<Event[]>;
  private timer?: number;

  constructor(private eventService: EventService, private router: Router, public dialog: MatDialog) {}

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
    
    this.recentEvents$ = events$.pipe(map(
      events => [...events].sort((a, b) => new Date(b.startDate).getTime() - new Date(a.startDate).getTime())
    ));
  }

  ngOnDestroy(): void {
    if (this.timer) {
      clearInterval(this.timer);
    }
  }

  goToCreateEvent(): void {
    this.router.navigate(['/admin/create']);
  }

  editEvent(id: string): void {
    this.router.navigate(['/admin/edit', id]);
  }

  async deleteEvent(id: string): Promise<void> {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      width: '350px',
      data: {
        title: 'Confirm Deletion',
        message: 'Are you sure you want to delete this event? This action cannot be undone.',
        confirmButtonText: 'Delete'
      }
    });

    dialogRef.afterClosed().subscribe(async (result) => {
      if (result) {
        try {
          await this.eventService.deleteEvent(id);
        } catch (error) {
          console.error('Failed to delete event:', error);
        }
      }
    });
  }
}