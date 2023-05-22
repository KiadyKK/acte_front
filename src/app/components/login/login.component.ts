import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth/auth.service';
import { StorageService } from 'src/app/services/storage/storage.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
})
export class LoginComponent implements OnInit {
  form: any = {
    trigramme: null,
    password: null,
  };
  isLoginFailed = false;
  isLoggedIn: boolean = false;
  errorMessage = '';

  constructor(
    private authService: AuthService,
    private storageService: StorageService,
    private router: Router
  ) {}

  ngOnInit(): void {
    const loggedIn = this.storageService.getItem('authorization');
    if (loggedIn) {
      this.router.navigate(['']);
    }
  }

  onSubmit(): void {
    this.authService.login(this.form).subscribe({
      next: (data) => {
        if (data.hasOwnProperty('token')) {
          this.storageService.saveUser(data);
          location.reload();
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
