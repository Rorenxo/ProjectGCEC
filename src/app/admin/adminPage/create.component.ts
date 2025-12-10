import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Router, RouterModule } from '@angular/router';
import { Event, EventService } from '../event.service';
import { finalize } from 'rxjs/operators';
import { EventFormComponent } from './event-form.component';

@Component({
  selector: 'app-create',
  standalone: true,
  imports: [
    CommonModule,
    EventFormComponent,
    RouterModule
  ],
  templateUrl: './create.component.html',
  styleUrls: ['./create.component.css'],
})
export class CreateEventComponent {
  uploading = false;
  eventData: Omit<Event, 'id'> = this.getInitialEventData();
  successMessage: string | null = null;
  errorMessage: string | null = null;

  constructor(
    private eventService: EventService, 
    private router: Router, 
    private http: HttpClient
  ) {}

  private getInitialEventData(): Omit<Event, 'id'> {
    return { title: '', description: '', startDate: '', endDate: '', department: 'CSS', eventType: 'social', location: '', imageUrl: '' };
  }
  
  createEvent({ eventData, file }: { eventData: Omit<Event, 'id'>, file: File | null }) {
    if (!file) {
      this.errorMessage = "An image is required to create an event.";
      return;
    }

    this.uploading = true;
    this.successMessage = null;
    this.errorMessage = null;
    const formData = new FormData();
    formData.append('file', file);
    formData.append('upload_preset', 'AngularGCEC'); 

    this.http.post<any>('https://api.cloudinary.com/v1_1/dqvolqdno/image/upload', formData)
      .pipe(finalize(() => this.uploading = false))
      .subscribe(async (res) => {
        eventData.imageUrl = res.secure_url;
        const newEvent = await this.eventService.createEvent(eventData);
        this.successMessage = `Event was created successfully!`;
        this.eventData = this.getInitialEventData();
        setTimeout(() => this.successMessage = null, 3000);
      }, (err) => {
        console.error('Image upload failed:', err);
        this.errorMessage = 'Failed to upload image. Please try again.';
      });
  }
}
