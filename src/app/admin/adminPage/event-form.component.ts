import { Component, Input, Output, EventEmitter, ViewChild, ElementRef, ChangeDetectorRef, OnChanges, SimpleChanges } from '@angular/core';
import { CommonModule, TitleCasePipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Event } from '../event.service';

@Component({
  selector: 'app-event-form',
  standalone: true,
  imports: [CommonModule, FormsModule, TitleCasePipe],
  templateUrl: './event-form.component.html',
  styleUrls: ['./create.component.css'] 
})
export class EventFormComponent implements OnChanges {
  @Input() eventData: Omit<Event, 'id'> | Event = this.getInitialEventData();
  @Input() uploading = false;
  @Input() submitLabel = 'Submit';

  @Output() save = new EventEmitter<{ eventData: Omit<Event, 'id'> | Event, file: File | null }>();

  departments: Event['department'][] = ['CSS', 'CEAS', 'CAHS', 'CBA', 'CHTM', 'ALL' ];
  eventTypes: Event['eventType'][] = ['social', 'activities', 'seminar', 'meetings', 'sports'];

  selectedFile: File | null = null;
  imagePreview: string | ArrayBuffer | null = null;
  isDragging = false;
  minEndDate: string = '';

  @ViewChild('fileUpload') fileUpload!: ElementRef<HTMLInputElement>;

  constructor(private cdr: ChangeDetectorRef) {}

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['eventData'] && this.eventData) {
      this.imagePreview = this.eventData.imageUrl || null;
      this.onStartDateChange();
    }
  }

  getInitialEventData(): Omit<Event, 'id'> {
    return { title: '', description: '', startDate: '', endDate: '', department: 'CSS', eventType: 'social', location: '', imageUrl: '' };
  }

  onFileSelected(event: any): void {
    const file = event.target.files[0];
    if (file) {
      this.selectedFile = file;
      const reader = new FileReader();
      reader.onload = () => {
        this.imagePreview = reader.result;
        this.cdr.detectChanges();
      };
      reader.readAsDataURL(file);
    }
  }

  onStartDateChange(): void {
    if (this.eventData.startDate) {
      this.minEndDate = this.eventData.startDate;
      if (this.eventData.endDate < this.eventData.startDate) {
        this.eventData.endDate = this.eventData.startDate;
      }
    }
  }

  removeImage(): void {
    this.selectedFile = null;
    this.imagePreview = null;
    this.eventData.imageUrl = '';
    if (this.fileUpload) {
      this.fileUpload.nativeElement.value = '';
    }
  }

  onDragOver(event: DragEvent): void {
    event.preventDefault();
    event.stopPropagation();
    this.isDragging = true;
  }

  onDragLeave(event: DragEvent): void {
    event.preventDefault();
    event.stopPropagation();
    this.isDragging = false;
  }

  onDrop(event: DragEvent): void {
    event.preventDefault();
    event.stopPropagation();
    this.isDragging = false;
    const files = event.dataTransfer?.files;
    if (files && files.length > 0) {
      this.onFileSelected({ target: { files: files } });
    }
  }

  isFormInvalid(): boolean {
    const isCreating = !('id' in this.eventData);
    const imageRequired = isCreating && !this.selectedFile;
    return !this.eventData.title || !this.eventData.startDate || !this.eventData.endDate || !this.eventData.description || imageRequired || this.uploading;
  }

  onSubmit(): void {
    if (!this.isFormInvalid()) {
      this.save.emit({ eventData: this.eventData, file: this.selectedFile });
    }
  }
}