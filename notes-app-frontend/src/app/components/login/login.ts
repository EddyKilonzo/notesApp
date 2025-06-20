import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../../services/auth';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './login.html',
  styleUrls: ['./login.css']
})
/**
 * This component is used to login the user
 */
export class LoginComponent implements OnInit {
  loginData = { email: '', password: '' };
  isLoading = false;
  errorMessage = '';
  successMessage = '';

  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit(): void {
    if (this.authService.isLoggedIn()) {
      this.router.navigate(['/']);
    }
  }

  showMessage(text: string, type: 'success' | 'error' = 'success'): void {
    if (type === 'success') {
      this.successMessage = text;
      this.errorMessage = '';
    } else {
      this.errorMessage = text;
      this.successMessage = '';
    }
  }

  onSubmit(): void {
    if (this.loginData.email && this.loginData.password) {
      this.isLoading = true;
      this.errorMessage = '';
      this.successMessage = '';

      this.authService.login(this.loginData).subscribe({
        next: () => {
          this.showMessage('Login successful! Redirecting...', 'success');
          setTimeout(() => {
            this.router.navigate(['/']);
          }, 1000);
        },
        error: (error) => {
          this.isLoading = false;
          this.showMessage(error.error?.message || 'Login failed. Please check your credentials.', 'error');
        }
      });
    } else {
      this.showMessage('Please fill in all fields', 'error');
    }
  }
}
