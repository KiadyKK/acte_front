import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { ActeMasseService } from 'src/app/services/acteMasse/acte-masse.service';
import { StorageService } from 'src/app/services/storage/storage.service';

@Component({
  selector: 'app-widget',
  templateUrl: './widget.component.html',
  styleUrls: ['./widget.component.css'],
})
export class WidgetComponent implements OnInit {
  lst_monitoring: Array<any>;

  @Output() onActeClick: EventEmitter<number> = new EventEmitter();

  constructor(
    private storageService: StorageService,
    private acteMasseService: ActeMasseService
  ) {}

  ngOnInit(): void {
    let id_role = this.storageService.getItem('status');
    let user_id = this.storageService.getItem('user_id');
    this.acteMasseService.monitoring(id_role, user_id, 1).subscribe({
      next: (data) => {
        this.lst_monitoring = data;
      },
    });
  }

  affichageValidateur(idActe: number): void {
    this.onActeClick.emit(idActe)
  }
}
