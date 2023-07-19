import { Component, Input } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-modal-check-service',
  templateUrl: './modal-check-service.component.html',
  styleUrls: ['./modal-check-service.component.css']
})
export class ModalCheckServiceComponent {
  @Input() withService: Array<any> = [];
  @Input() noService: Array<any> = [];

  constructor(public activeModal: NgbActiveModal) {}
}
