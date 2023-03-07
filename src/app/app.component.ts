import { Component } from '@angular/core';
import { StorageService } from './services/storage/storage.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent {
  trigramme: string;
  isLoggedIn: boolean;

  constructor(
    private storageService: StorageService,
  ) {}

  ngOnInit(): void {
    this.isLoggedIn = this.storageService.getItem('token');

    if (this.isLoggedIn) {
      const trigramme = this.storageService.getItem('trigramme');
      this.trigramme = trigramme;
    }
  }

  logout(): void {
    this.storageService.clean();
  }
}
