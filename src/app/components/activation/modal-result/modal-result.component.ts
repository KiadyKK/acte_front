import { Component, Input } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-modal-result',
  templateUrl: './modal-result.component.html',
  styleUrls: ['./modal-result.component.css'],
})
export class ModalResultComponent {
  @Input() client: string | null;

  constructor(public activeModal: NgbActiveModal) {}
}
