import { Component, Input } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-modal-log',
  templateUrl: './modal-log.component.html',
  styleUrls: ['./modal-log.component.css']
})
export class ModalLogComponent {
  @Input() logs: Array<any>;

  constructor(public activeModal: NgbActiveModal) {}
}
