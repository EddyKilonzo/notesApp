import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Note } from '../models/note';

@Injectable({
  providedIn: 'root'
})
export class NotesService {
  private apiUrl = 'http://localhost:3000/notes';

  constructor(private http: HttpClient) { }

  private getHeaders(): HttpHeaders {
    const token = localStorage.getItem('token');
    return new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    });
  }

  // Get all notes
  getNotes(): Observable<Note[]> {
    return this.http.get<Note[]>(this.apiUrl, { headers: this.getHeaders() });
  }

  // Create a new note
  createNote(note: { title: string; content: string }): Observable<Note> {
    return this.http.post<Note>(this.apiUrl, note, { headers: this.getHeaders() });
  }

  // Delete a note
  deleteNote(id: string): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}`, { headers: this.getHeaders() });
  }
}
