import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { NotesService } from '../../services/notes';
import { Note } from '../../models/note';
import { AuthService } from '../../services/auth';

@Component({
  selector: 'app-notes-list',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './notes-list.html',
  styleUrls: ['./notes-list.css']
})
/**
 * This component is used to display the list of notes
 */
export class NotesListComponent implements OnInit {
  notes: Note[] = [];
  newNote: Note = { title: '', content: '' };
  message = '';
  messageType: 'success' | 'error' = 'success';

  constructor(
    private notesService: NotesService,
    private authService: AuthService,
    private router: Router
  ) {}

  /**
   * This method is used to get the current user
   * @returns The current user
   */
  get currentUser() {
    const user = this.authService.getCurrentUser();
    return user ? user.name : '';
  }

  ngOnInit(): void {
    if (!this.authService.isLoggedIn()) {
      this.router.navigate(['/login']);
      return;
    }
    this.loadNotes();
  }

  showMessage(text: string, type: 'success' | 'error' = 'success'): void {
    this.message = text;
    this.messageType = type;
    setTimeout(() => {
      this.message = '';
    }, 3000);
  }
  /**
   * This method is used to load the notes
   * @returns The notes
   */

  loadNotes(): void {
    this.notesService.getNotes().subscribe({
      next: (notes: Note[]) => {
        this.notes = notes;
      },
      error: (error: any) => {
        if (error.status === 401) {
          this.authService.logout();
          this.router.navigate(['/login']);
        } else {
          this.showMessage('Failed to load notes', 'error');
        }
      }
    });
  }

  /**
   * This method is used to add a note
   * @returns The note
   */
  addNote(): void {
    if (this.newNote.title.trim() && this.newNote.content.trim()) {
      this.notesService.createNote(this.newNote).subscribe({
        next: (note: Note) => {
          this.notes.unshift(note);
          this.newNote = { title: '', content: '' };
          this.showMessage('Note added successfully!');
        },
        error: (error: any) => {
          this.showMessage('Failed to create note', 'error');
        }
      });
    } else {
      this.showMessage('Please fill in both title and content', 'error');
    }
  }

  /**
   * This method is used to delete a note
   * @param id - The id of the note
   * @returns The note
   */
  deleteNote(id: string | undefined): void {
    if (!id) {
      this.showMessage('Cannot delete note: ID is missing', 'error');
      return;
    }
    
    if (confirm('Are you sure you want to delete this note?')) {
      this.notesService.deleteNote(id).subscribe({
        next: () => {
          this.notes = this.notes.filter(note => note.id !== id);
          this.showMessage('Note deleted successfully!');
        },
        error: (error: any) => {
          this.showMessage('Failed to delete note', 'error');
        }
      });
    }
  }

  /**
   * This method is used to logout the user
   * @returns The user
   */
  logout(): void {
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}
