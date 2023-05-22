import { Component, Input } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-modal-validation',
  templateUrl: './modal-validation.component.html',
  styleUrls: ['./modal-validation.component.css']
})
export class ModalValidationComponent {
  @Input() error: boolean;

  constructor(public activeModal: NgbActiveModal) {}
}
