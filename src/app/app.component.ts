import { Component } from '@angular/core';
import { StorageService } from './services/storage/storage.service';

interface SidenavToggle {
  screenWidth: number;
  collapsed: boolean;
}

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent {
  trigramme: string;
  isLoggedIn: boolean;

  isSideNavCollapsed = false;
  screenWidth = 0;

  constructor(private storageService: StorageService) {}

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

  onToggleSidenav(data: SidenavToggle): void {
    this.screenWidth = data.screenWidth;
    this.isSideNavCollapsed = data.collapsed;
  }
}
