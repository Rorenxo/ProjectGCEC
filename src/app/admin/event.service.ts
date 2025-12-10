import { Injectable } from '@angular/core';
import { collection, addDoc, getDocs, doc, deleteDoc, query, onSnapshot, updateDoc } from 'firebase/firestore';
import { BehaviorSubject, Observable, map } from 'rxjs';
import { db } from '../UTILS/firebase';

export interface Event {
  id?: string;
  title: string;
  description: string;
  startDate: string;
  endDate: string;
  department: 'CSS' | 'CEAS' | 'CAHS' | 'CBA' | 'CHTM'| 'ALL';
  eventType: 'social' | 'activities' | 'seminar' | 'meetings' | 'sports';
  location: string;
  imageUrl: string;
}

export interface Student {
  id?: string;
  firstName: string;
  lastName: string;
  email: string;
  role: 'student';
}

@Injectable({
  providedIn: 'root'
})
export class EventService {
  private eventsCollection = collection(db, 'events');
  private studentsCollection = collection(db, 'students');

  private eventsSubject = new BehaviorSubject<Event[]>([]);
  public events$ = this.eventsSubject.asObservable();

  private studentsSubject = new BehaviorSubject<Student[]>([]);
  public students$ = this.studentsSubject.asObservable();
  getEvent: any;

  constructor() {
    // Use onSnapshot for real-time updates
    onSnapshot(query(this.eventsCollection), (querySnapshot) => {
      const events = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Event));
      this.eventsSubject.next(events);
    });

    // Use onSnapshot for real-time updates for students
    onSnapshot(query(this.studentsCollection), (querySnapshot) => {
      const students = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Student));
      this.studentsSubject.next(students);
    });
  }

  async createEvent(event: Omit<Event, 'id'>) {
    if (
      event.title &&
      event.description &&
      event.startDate &&
      event.endDate &&
      event.department &&
      event.eventType &&
      event.location &&
      event.imageUrl
    ) {
      await addDoc(this.eventsCollection, event);
    } else {
      throw new Error('New event data is incomplete.');
    }
  }

  async deleteEvent(id: string) {
    const eventDoc = doc(db, 'events', id);
    await deleteDoc(eventDoc);
  }

  getEventById(id: string): Observable<Event | undefined> {
    return this.events$.pipe(
      map(events => events.find(event => event.id === id))
    );
  }

  async updateEvent(id: string, eventData: Partial<Event>): Promise<void> {
    const eventDoc = doc(db, 'events', id);
    await updateDoc(eventDoc, eventData);
  }
}