import { Routes } from '@angular/router';
import { LoginComponent } from './components/login/login';
import { SignupComponent } from './components/signup/signup';
import { NotesListComponent } from './components/notes-list/notes-list';

export const routes: Routes = [
  { path: '', component: NotesListComponent },
  { path: 'login', component: LoginComponent },
  { path: 'signup', component: SignupComponent },
  { path: '**', redirectTo: '' }
];
