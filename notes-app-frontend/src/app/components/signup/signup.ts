import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../../services/auth';

@Component({
  selector: 'app-signup',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './signup.html',
  styleUrls: ['./signup.css']
})
export class SignupComponent implements OnInit {
  signupData = { email: '', password: '', name: '' };
  isLoading = false;
  errorMessage = '';
  successMessage = '';

  constructor(
    private authService: AuthService,
    private router: Router
  ) {}
 /**
  * This method is used to check if the user is logged in and redirect to the home page
  */
  ngOnInit(): void {
    if (this.authService.isLoggedIn()) {
      this.router.navigate(['/']);
    }
  }
  /**
   * 
   * @param text - The text to display in the message
   * @param type - The type of message (success or error)
   */

  showMessage(text: string, type: 'success' | 'error' = 'success'): void {
    if (type === 'success') {
      this.successMessage = text;
      this.errorMessage = '';
    } else {
      this.errorMessage = text;
      this.successMessage = '';
    }
  }
  /**
   * This method is used to show a message to the user
   * @param text - The text to display in the message
   * @param type - The type of message (success or error)
   */

  onSubmit(): void {
    if (this.signupData.email && this.signupData.password && this.signupData.name) {
      this.isLoading = true;
      this.errorMessage = '';
      this.successMessage = '';

      this.authService.signup(this.signupData).subscribe({
        next: () => {
          this.showMessage('Account created successfully! Redirecting...', 'success');
          setTimeout(() => {
            this.router.navigate(['/']);
          }, 1000);
        },
        error: (error: any) => {
          this.isLoading = false;
          this.showMessage(error.error?.message || 'Signup failed. Please try again.', 'error');
        }
      });
    } else {
      this.showMessage('Please fill in all fields', 'error');
    }
  }
}
