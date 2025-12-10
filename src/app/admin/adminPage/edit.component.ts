import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Router, ActivatedRoute, RouterModule } from '@angular/router';
import { Event, EventService } from '../event.service';
import { finalize, switchMap } from 'rxjs/operators';
import { of } from 'rxjs';
import { EventFormComponent } from './event-form.component';

@Component({
  selector: 'app-edit',
  standalone: true,
  imports: [
    CommonModule,
    EventFormComponent,
    RouterModule
  ],
  templateUrl: './edit.component.html',
  styleUrls: ['./create.component.css'],
})
export class EditEventComponent implements OnInit {
  eventData: Event | null = null;
  uploading = false;
  errorMessage: string | null = null;
  successMessage: string | null = null;

  private readonly CLOUDINARY_URL = 'https://api.cloudinary.com/v1_1/dqvolqdno/image/upload';
  private readonly UPLOAD_PRESET = 'AngularGCEC';

  constructor(
    private eventService: EventService,
    private router: Router,
    private route: ActivatedRoute,
    private http: HttpClient
  ) {}

  ngOnInit(): void {
    this.loadEvent();
  }

  private loadEvent(): void {
    this.route.paramMap.pipe(
      switchMap(params => {
        const eventId = params.get('id');
        if (!eventId) {
          this.errorMessage = 'Event ID is required';
          return of(null);
        }
        return this.eventService.getEventById(eventId);
      })
    ).subscribe({
      next: (event) => {
        if (event) {
          this.eventData = {
            ...event,
            startDate: this.formatDateForInput(event.startDate),
            endDate: this.formatDateForInput(event.endDate)
          };
        } else {
          this.errorMessage = 'Event not found';
        }
      },
      error: (error) => {
        console.error('Error loading event:', error);
        this.errorMessage = 'Failed to load event';
      }
    });
  }

  private formatDateForInput(dateStr: string): string {
    if (!dateStr) return '';
    try {
      const date = new Date(dateStr);
      if (isNaN(date.getTime())) return '';
      date.setMinutes(date.getMinutes() - date.getTimezoneOffset());
      return date.toISOString().slice(0, 16);
    } catch (error) {
      console.error('Error formatting date:', error);
      return '';
    }
  }

  async updateEvent({ eventData, file }: { eventData: Event, file: File | null }): Promise<void> {
    if (!this.eventData?.id) {
      this.errorMessage = 'Event data is not available';
      return;
    }

    this.uploading = true;
    this.errorMessage = null;
    this.successMessage = null;

    try {
      if (file) {
        await this.uploadImageAndUpdateEvent(eventData, file);
      } else {
        await this.updateEventDataOnly(eventData);
      }
      this.loadEvent(); 
      this.successMessage = `Event "${eventData.title}" updated successfully!`;
      setTimeout(() => this.successMessage = null, 5000);
    } catch (error) {
      console.error('Error updating event:', error);
      this.errorMessage = 'Failed to update event. Please try again.';
    } finally {
      this.uploading = false;
    }
  }

  private async uploadImageAndUpdateEvent(eventData: Event, file: File): Promise<void> {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('upload_preset', this.UPLOAD_PRESET);

    const uploadResponse = await this.http.post<any>(this.CLOUDINARY_URL, formData)
      .pipe(finalize(() => {}))
      .toPromise();

    if (!uploadResponse?.secure_url) {
      throw new Error('Image upload failed: No secure URL received');
    }

    eventData.imageUrl = uploadResponse.secure_url;
    await this.eventService.updateEvent(this.eventData!.id!, eventData);
  }

  private async updateEventDataOnly(eventData: Event): Promise<void> {
    await this.eventService.updateEvent(this.eventData!.id!, eventData);
  }
}
