import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth/auth.service';
import { StorageService } from 'src/app/services/storage/storage.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
})
export class LoginComponent {
  form: any = {
    trigramme: null,
    password: null,
  };
  isLoginFailed = false;
  errorMessage = '';

  constructor(
    private authService: AuthService,
    private storageService: StorageService,
    private router: Router
  ) {}

  onSubmit(): void {
    this.authService.login(this.form).subscribe({
      next: (data) => {
        if (data.hasOwnProperty('token')) {
          this.storageService.saveUser(data);
          this.router.navigate(['/desactivation'])
        } else {
          this.errorMessage = data.permission;
          this.isLoginFailed = true;
        }
      },
      error: (err) => {
        this.errorMessage = err.error.message;
        this.isLoginFailed = true;
      },
    });
  }
}
