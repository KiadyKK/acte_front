import { Component, Input } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-modal-saving',
  templateUrl: './modal-saving.component.html',
  styleUrls: ['./modal-saving.component.css']
})
export class ModalSavingComponent {
  @Input() error: string | null;
  @Input() type: number;

  constructor(public activeModal: NgbActiveModal) {}
}
