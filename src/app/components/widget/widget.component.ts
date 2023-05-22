import { Component, OnInit } from '@angular/core';
import { Monitoring } from 'src/app/models/monitoring';
import { ActeMasseService } from 'src/app/services/acteMasse/acte-masse.service';
import { StorageService } from 'src/app/services/storage/storage.service';

@Component({
  selector: 'app-widget',
  templateUrl: './widget.component.html',
  styleUrls: ['./widget.component.css'],
})
export class WidgetComponent implements OnInit {
  dateRange = { start: null, end: null };

  monitoring: Monitoring[] = [];
  allMonitoring: Monitoring[] = [];

  searchEtat: string = '';
  searchAction: string = '';
  page = 1;
  pageSize = 15;

  id_role: number;
  user_id: number;

  constructor(
    private storageService: StorageService,
    private acteMasseService: ActeMasseService
  ) {}

  ngOnInit(): void {
    this.id_role = +this.storageService.getItem('status');
    this.user_id = +this.storageService.getItem('user_id');
    let data: any = {
      id_role: this.id_role,
      user_id: this.user_id,
      pageNumber: 1,
    };
    this.acteMasseService.monitoring(data).subscribe({
      next: (data) => {
        this.monitoring = data;
        this.allMonitoring = data;
      },
    });
  }

  searchByActe(event: string): void {
    this.monitoring = this.allMonitoring.filter((val) =>
      val.action.includes(event)
    );
  }

  searchByDate(event: any): void {
    let data: any = {
      id_role: this.id_role,
      user_id: this.user_id,
      pageNumber: 1,
      startDate: this.dateRange.start,
      endDate: this.dateRange.end
    };
    this.acteMasseService.monitoring(data).subscribe({
      next: (data) => {
        this.monitoring = data;
        this.allMonitoring = data;
      },
    });
  }

  searchByEtat(event: string): void {
    this.monitoring = this.allMonitoring.filter((val) =>
      val.etat.includes(event)
    );
  }
}
