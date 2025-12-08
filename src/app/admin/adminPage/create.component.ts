import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatSelectModule } from '@angular/material/select';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { Router } from '@angular/router';
import { Event, EventService } from '../event.service';
import { finalize } from 'rxjs/operators';

@Component({
  selector: 'app-create',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatSelectModule,
    MatProgressBarModule
  ],
  templateUrl: './create.component.html',  
  styleUrls: ['./create.component.css'],
})
export class CreateEventComponent {
  newEvent: Omit<Event, 'id'> = { title: '', description: '', startDate: '', endDate: '', department: 'CSS', eventType: 'social', imageUrl: '' };
  departments: Event['department'][] = ['CSS', 'CEAS', 'CAHS', 'CBA', 'CHTM'];
  eventTypes: Event['eventType'][] = ['social', 'activities', 'seminar', 'meetings', 'sports'];
  
  selectedFile: File | null = null;
  imagePreview: string | ArrayBuffer | null = null;
  uploading = false;

  constructor(private eventService: EventService, private router: Router, private http: HttpClient) {}

  onFileSelected(event: any): void {
    const file = event.target.files[0];
    if (file) {
      this.selectedFile = file;
      const reader = new FileReader();
      reader.onload = () => this.imagePreview = reader.result;
      reader.readAsDataURL(file);
    }
  }

  async createEvent() {
    if (this.isFormInvalid() || !this.selectedFile) return;

    this.uploading = true;
    const formData = new FormData();
    formData.append('file', this.selectedFile);
    formData.append('upload_preset', 'AngularGCEC'); 

    this.http.post<any>('https://api.cloudinary.com/v1_1/dqvolqdno/image/upload', formData)
      .pipe(finalize(() => this.uploading = false))
      .subscribe(async (res) => {
        this.newEvent.imageUrl = res.secure_url;
        await this.eventService.createEvent(this.newEvent);
        this.router.navigate(['/admin/events']);
      }, (err) => {
        console.error('Image upload failed:', err);
      });
  }

  isFormInvalid(): boolean {
    return !this.newEvent.title || !this.newEvent.startDate || !this.newEvent.endDate || !this.newEvent.description || !this.selectedFile || this.uploading;
  }
}
